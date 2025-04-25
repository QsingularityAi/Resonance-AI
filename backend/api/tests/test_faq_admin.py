# backend/api/tests/test_faq_admin.py
import hashlib
import tempfile

from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from unittest.mock import MagicMock, call

from backend.api.models import Knowledgebase, FAQCategory, FAQ
from backend.api.di.di import DI
from hw_rag.dataclasses import QDocType, QSourceType, QSourceOriginType, QSourceOrigin
from django_scopes import scopes_disabled

class FAQAdminTest(TestCase):
    @scopes_disabled()
    def setUp(self):
        # First set up DI container with mock
        self.mock_qdrant = MagicMock()
        self.mock_qdrant.configure_mock(**{
            'get_collection_name.side_effect': lambda kb_id: f"knowledge_{kb_id}",
            'smart_upsert': MagicMock(),
            'delete_by_reference_id': MagicMock()
        })

        self.container = DI()
        self.container.RAG.qdrant_service.override(self.mock_qdrant)
        self.container.wire(packages=['backend.api', 'backend.services'])

        # Create admin user and test data
        self.admin_user = User.objects.create_superuser(
            username='admin', email='admin@example.com', password='password123'
        )
        self.client = Client()
        self.client.login(username='admin', password='password123')

        # Test data setup
        self.knowledgebase = Knowledgebase.objects.create(name="Test KB")
        self.category = FAQCategory.objects.create(
            name="Test Category",
            knowledgebase=self.knowledgebase
        )

        self.faq1 = FAQ.objects.create(
            category=self.category,
            question="Initial Question 1",
            answer="Initial Answer 1"
        )
        self.faq2 = FAQ.objects.create(
            category=self.category,
            question="Initial Question 2",
            answer="Initial Answer 2"
        )

        self.mock_qdrant.reset_mock()

    def tearDown(self):
        self.container.unwire()

    def verify_qdrant_document(self, call_args, expected_text, faq_id, expected_category=None):
        """Helper method to verify Qdrant document structure"""
        _, documents, ref_id = call_args[0]
        doc = documents[0]

        # Get the actual FAQ and its category
        faq = FAQ.objects.get(id=faq_id)

        # Verify document content
        self.assertEqual(doc.text, expected_text)
        self.assertEqual(doc.doc_type, QDocType.FAQ)
        self.assertEqual(doc.reference_id, f"faq-{faq_id}")

        # Verify checksum
        expected_checksum = hashlib.md5(f"faq-{faq.id} {faq.question} {faq.answer}".encode('utf-8')).hexdigest()
        self.assertEqual(doc.checksum, expected_checksum)

        # Verify source metadata
        self.assertEqual(doc.source.source_type, QSourceType.FAQ)
        self.assertEqual(doc.source.source_origin.type, QSourceOriginType.FAQ_CATEGORY)
        self.assertEqual(doc.source.source_origin.id, doc.source.source_origin.id)
        self.assertEqual(doc.source.reference_id, f"faq-{faq_id}")
        self.assertEqual(doc.source.url, "")

        # Verify category if provided
        if expected_category:
            self.assertEqual(faq.category, expected_category)

    @scopes_disabled()
    def test_edit_existing_faq(self):
        """Test editing an existing FAQ"""
        url = reverse('admin:api_faqcategory_change', args=[self.category.id])

        data = {
            'name': 'Test Category',
            'knowledgebase': self.knowledgebase.id,
            'faqs-TOTAL_FORMS': '1',
            'faqs-INITIAL_FORMS': '1',
            'faqs-MIN_NUM_FORMS': '0',
            'faqs-MAX_NUM_FORMS': '1000',
            'faqs-0-id': self.faq1.id,
            'faqs-0-category': self.category.id,
            'faqs-0-question': 'Updated Question',
            'faqs-0-answer': 'Updated Answer',
            '_save': 'Save',
        }

        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 302)

        # Verify FAQ was updated in database
        updated_faq = FAQ.objects.get(id=self.faq1.id)
        self.assertEqual(updated_faq.question, 'Updated Question')
        self.assertEqual(updated_faq.answer, 'Updated Answer')

        # Verify Qdrant update
        self.mock_qdrant.smart_upsert.assert_called_once()
        expected_text = "Updated Question\n\nUpdated Answer"
        self.verify_qdrant_document(
            self.mock_qdrant.smart_upsert.call_args,
            expected_text,
            self.faq1.id
        )

    @scopes_disabled()
    def test_delete(self):
        """Test deleting a FAQ"""
        url = reverse('admin:api_faqcategory_change', args=[self.category.id])

        data = {
            'name': 'Test Category',
            'knowledgebase': self.knowledgebase.id,
            'faqs-TOTAL_FORMS': '2',
            'faqs-INITIAL_FORMS': '2',
            'faqs-MIN_NUM_FORMS': '0',
            'faqs-MAX_NUM_FORMS': '1000',
            'faqs-0-id': self.faq1.id,
            'faqs-0-category': self.category.id,
            'faqs-0-question': self.faq1.question,
            'faqs-0-answer': self.faq1.answer,
            'faqs-1-id': self.faq2.id,
            'faqs-1-category': self.category.id,
            'faqs-1-DELETE': 'on',
            '_save': 'Save',
        }

        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 302)

        # Verify database state
        self.assertEqual(FAQ.objects.count(), 1)
        self.assertFalse(FAQ.objects.filter(id=self.faq2.id).exists())

        # Verify Qdrant deletion
        self.mock_qdrant.delete_by_reference_id.assert_called_once_with(
            self.knowledgebase.id,
            f"faq-{self.faq2.id}"
        )

    @scopes_disabled()
    def test_batch_operations(self):
        """Test multiple operations in one form submission"""
        url = reverse('admin:api_faqcategory_change', args=[self.category.id])

        data = {
            'name': 'Test Category',
            'knowledgebase': self.knowledgebase.id,
            'faqs-TOTAL_FORMS': '4',
            'faqs-INITIAL_FORMS': '2',
            'faqs-MIN_NUM_FORMS': '0',
            'faqs-MAX_NUM_FORMS': '1000',
            # Update existing FAQ
            'faqs-0-id': self.faq1.id,
            'faqs-0-category': self.category.id,
            'faqs-0-question': 'Updated Question 1',
            'faqs-0-answer': 'Updated Answer 1',
            # Delete existing FAQ
            'faqs-1-id': self.faq2.id,
            'faqs-1-category': self.category.id,
            'faqs-1-DELETE': 'on',
            # Add new FAQ 1
            'faqs-2-id': '',
            'faqs-2-category': self.category.id,
            'faqs-2-question': 'New Question 1',
            'faqs-2-answer': 'New Answer 1',
            # Add new FAQ 2
            'faqs-3-id': '',
            'faqs-3-category': self.category.id,
            'faqs-3-question': 'New Question 2',
            'faqs-3-answer': 'New Answer 2',
            '_save': 'Save',
        }

        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 302)

        # Verify database state
        self.assertEqual(FAQ.objects.count(), 3)  # 1 updated + 2 new - 1 deleted

        # Get the new FAQs for verification
        new_faqs = FAQ.objects.filter(
            question__in=['New Question 1', 'New Question 2']
        ).order_by('question')

        # Verify Qdrant operations
        self.assertEqual(self.mock_qdrant.smart_upsert.call_count, 3)

        # Verify all Qdrant document insertions
        expected_calls = [
            ('Updated Question 1\n\nUpdated Answer 1', self.faq1.id),
            ('New Question 1\n\nNew Answer 1', new_faqs[0].id),
            ('New Question 2\n\nNew Answer 2', new_faqs[1].id),
        ]

        actual_calls = self.mock_qdrant.smart_upsert.call_args_list
        for (expected_text, expected_id), actual_call in zip(expected_calls, actual_calls):
            self.verify_qdrant_document(actual_call, expected_text, expected_id)

        # Verify deletion
        self.mock_qdrant.delete_by_reference_id.assert_called_once_with(
            self.knowledgebase.id,
            f"faq-{self.faq2.id}"
        )

    @scopes_disabled()
    def test_export_csv(self):
        """Test exporting FAQs to CSV"""
        # Create additional test FAQs for more comprehensive testing
        faq3 = FAQ.objects.create(
            category=self.category,
            question="Question with, comma",  # Test handling of commas
            answer="Answer with\nmultiple\nlines"  # Test handling of newlines
        )

        url = reverse('admin:faqcategory_export_csv', args=[self.category.id])
        response = self.client.get(url)

        # Verify response metadata
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'text/csv')
        self.assertEqual(
            response['Content-Disposition'],
            f'attachment; filename="{self.category.name}_faqs.csv"'
        )

        # Decode the response content
        content = response.content.decode('utf-8-sig')  # Handle BOM

        # Parse CSV content
        import csv
        from io import StringIO

        csv_reader = csv.reader(StringIO(content))
        rows = list(csv_reader)

        # Verify header
        self.assertEqual(rows[0], ['id', 'question', 'answer'])

        # Convert FAQ data to comparable format
        expected_data = [
            [str(self.faq1.id), "Initial Question 1", "Initial Answer 1"],
            [str(self.faq2.id), "Initial Question 2", "Initial Answer 2"],
            [str(faq3.id), "Question with, comma", "Answer with\nmultiple\nlines"],
        ]

        # Verify data rows (excluding header)
        self.assertEqual(len(rows) - 1, len(expected_data))  # Check number of data rows

        # Sort both lists by ID to ensure consistent comparison
        actual_data = sorted(rows[1:], key=lambda x: int(x[0]))
        expected_data = sorted(expected_data, key=lambda x: int(x[0]))

        # Compare each row
        for actual_row, expected_row in zip(actual_data, expected_data):
            self.assertEqual(actual_row, expected_row)

    @scopes_disabled()
    def test_import_csv(self):
        """Test importing FAQs from CSV covering updates, deletions, and new entries"""
        # Keep one existing FAQ for update testing, delete the other
        self.faq2.delete()
        self.mock_qdrant.reset_mock()

        # Store original FAQ data for unmodified import test
        original_question = self.faq1.question
        original_answer = self.faq1.answer

        # Create CSV content with various test cases
        csv_content = (
            'id,question,answer\n'
            # Unmodified existing FAQ (should not trigger update)
            f'{self.faq1.id},{original_question},{original_answer}\n'
            # Modified existing FAQ
            f'{self.faq1.id},Updated Existing,New Answer for Existing\n'
            # Try to update non-existent FAQ (should create new)
            '999,Should Create New,Because ID does not exist\n'
            # New FAQs without IDs
            ',New FAQ 1,Answer 1\n'
            ',New FAQ 2,"Answer 2 with\nmultiple lines"\n'
            ',New FAQ 3,"Answer with, comma"\n'
        )

        # Create a temporary CSV file
        with tempfile.NamedTemporaryFile(mode='w+', suffix='.csv', newline='', encoding='utf-8') as temp_csv:
            temp_csv.write(csv_content)
            temp_csv.seek(0)

            url = reverse('admin:faqcategory_import_csv', args=[self.category.id])

            # First request - get the form
            response = self.client.get(url)
            self.assertEqual(response.status_code, 200)

            # Create an FAQ that should be deleted by the import
            faq_to_delete = FAQ.objects.create(
                category=self.category,
                question="Should be deleted",
                answer="This FAQ should be deleted by import"
            )

            # Reset mock to clear the initial creation calls
            self.mock_qdrant.reset_mock()

            # Second request - post the CSV file
            with open(temp_csv.name, 'rb') as csv_file:
                data = {
                    'csv_file': csv_file,
                    'remove_others': 'on',  # Enable deletion of non-imported FAQs
                }
                response = self.client.post(url, data)

            self.assertEqual(response.status_code, 302)  # Redirect after successful import

        # Verify database state
        faqs = FAQ.objects.all().order_by('id')
        self.assertEqual(faqs.count(), 5)  # 1 updated + 4 new

        # Verify specific FAQ content
        expected_faqs = [
            (self.faq1.id, 'Updated Existing', 'New Answer for Existing'),  # Updated existing
            (None, 'Should Create New', 'Because ID does not exist'),  # Created despite ID
            (None, 'New FAQ 1', 'Answer 1'),
            (None, 'New FAQ 2', 'Answer 2 with\nmultiple lines'),
            (None, 'New FAQ 3', 'Answer with, comma'),
        ]

        # Verify each FAQ
        for faq, (expected_id, expected_question, expected_answer) in zip(faqs, expected_faqs):
            if expected_id:
                self.assertEqual(faq.id, expected_id)  # Verify ID preserved for update
            self.assertEqual(faq.question, expected_question)
            self.assertEqual(faq.answer, expected_answer)
            self.assertEqual(faq.category, self.category)

        # Verify FAQ that should be deleted is gone
        self.assertFalse(FAQ.objects.filter(id=faq_to_delete.id).exists())

        # Verify Qdrant operations
        # Count expected operations:
        # 1 for initial unmodified FAQ (due to Django signals)
        # 1 for updating the FAQ with new content
        # 4 for new FAQs
        # 1 for faq_to_delete creation (due to Django signals)
        self.assertEqual(self.mock_qdrant.smart_upsert.call_count, 5)

        # Group calls by FAQ ID to analyze operations
        upsert_calls = self.mock_qdrant.smart_upsert.call_args_list
        operations_by_faq = {}
        for call in upsert_calls:
            _, documents, _ = call[0]
            doc = documents[0]
            faq_id = doc.reference_id.split('-')[1]
            if faq_id not in operations_by_faq:
                operations_by_faq[faq_id] = []
            operations_by_faq[faq_id].append(doc)

        # Verify each Qdrant document's structure and content
        for faq in faqs:
            faq_ops = operations_by_faq.get(str(faq.id), [])
            if faq.id == self.faq1.id:
                # The existing FAQ should have one operation (only the content modification)
                self.assertEqual(len(faq_ops), 1, "Existing FAQ should have one operation (only when content changed)")
                # Verify the operation has the updated content
                self.assertEqual(faq_ops[0].text, "Updated Existing\n\nNew Answer for Existing")
            else:
                # New FAQs should have one operation each
                self.assertEqual(len(faq_ops), 1, "New FAQ should have one operation")

        # Verify deletion of non-imported FAQ
        self.mock_qdrant.delete_by_reference_id.assert_called_once_with(
            self.knowledgebase.id,
            f"faq-{faq_to_delete.id}"
        )

    @scopes_disabled()
    def test_import_csv_validation(self):
        """Test CSV import validation and error handling"""
        # Test invalid file type
        url = reverse('admin:faqcategory_import_csv', args=[self.category.id])
        with tempfile.NamedTemporaryFile(mode='w+', suffix='.txt') as temp_file:
            temp_file.write('invalid content')
            temp_file.seek(0)

            response = self.client.post(url, {'csv_file': temp_file})
            self.assertEqual(response.status_code, 302)  # Redirects on error

        # Test missing required columns
        invalid_csv_content = 'invalid_column,another_column\n1,2\n'
        with tempfile.NamedTemporaryFile(mode='w+', suffix='.csv', newline='') as temp_csv:
            temp_csv.write(invalid_csv_content)
            temp_csv.seek(0)

            response = self.client.post(url, {'csv_file': temp_csv})
            self.assertEqual(response.status_code, 302)  # Redirects on error

        # Verify no changes were made to the database
        self.assertEqual(
            FAQ.objects.count(),
            2,  # Original FAQs from setUp
            "Database should not be modified on invalid import"
        )

    @scopes_disabled()
    def test_create_category(self):
        """Test creating a new FAQ category with initial FAQs"""
        url = reverse('admin:api_faqcategory_add')
        data = {
            'name': 'New Category',
            'knowledgebase': self.knowledgebase.id,
            'faqs-TOTAL_FORMS': '2',
            'faqs-INITIAL_FORMS': '0',
            'faqs-MIN_NUM_FORMS': '0',
            'faqs-MAX_NUM_FORMS': '1000',
            # First FAQ
            'faqs-0-id': '',
            'faqs-0-question': 'New Question 1',
            'faqs-0-answer': 'New Answer 1',
            # Second FAQ
            'faqs-1-id': '',
            'faqs-1-question': 'New Question 2',
            'faqs-1-answer': 'New Answer 2',
            '_save': 'Save',
        }

        self.mock_qdrant.reset_mock()
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 302)

        # Verify category was created
        new_category = FAQCategory.objects.get(name='New Category')
        self.assertEqual(new_category.knowledgebase, self.knowledgebase)

        # Verify FAQs were created
        faqs = FAQ.objects.filter(category=new_category).order_by('question')
        self.assertEqual(faqs.count(), 2)

        # Verify FAQ content
        self.assertEqual(faqs[0].question, 'New Question 1')
        self.assertEqual(faqs[0].answer, 'New Answer 1')
        self.assertEqual(faqs[1].question, 'New Question 2')
        self.assertEqual(faqs[1].answer, 'New Answer 2')

        # Verify Qdrant operations
        self.assertEqual(self.mock_qdrant.smart_upsert.call_count, 2)

        # Verify each Qdrant document
        expected_docs = [
            ('New Question 1\n\nNew Answer 1', faqs[0].id),
            ('New Question 2\n\nNew Answer 2', faqs[1].id),
        ]

        for (expected_text, faq_id), call_args in zip(expected_docs, self.mock_qdrant.smart_upsert.call_args_list):
            self.verify_qdrant_document(call_args, expected_text, faq_id)

    @scopes_disabled()
    def test_move_category_between_knowledgebases(self):
        """Test moving an entire FAQ category to a different knowledgebase"""
        # Create a new knowledgebase
        new_kb = Knowledgebase.objects.create(name="New KB")

        # Add some more FAQs to ensure we test moving multiple FAQs
        faq3 = FAQ.objects.create(
            category=self.category,
            question="Question 3",
            answer="Answer 3"
        )
        faq4 = FAQ.objects.create(
            category=self.category,
            question="Question 4",
            answer="Answer 4"
        )

        # Prepare form data to move the entire category to new knowledgebase
        url = reverse('admin:api_faqcategory_change', args=[self.category.id])
        data = {
            'name': self.category.name,
            'knowledgebase': new_kb.id,  # Change the knowledgebase
            'faqs-TOTAL_FORMS': '4',
            'faqs-INITIAL_FORMS': '4',
            'faqs-MIN_NUM_FORMS': '0',
            'faqs-MAX_NUM_FORMS': '1000',
        }

        # Add all existing FAQs to the form data
        faqs = [self.faq1, self.faq2, faq3, faq4]
        for i, faq in enumerate(faqs):
            data.update({
                f'faqs-{i}-id': faq.id,
                f'faqs-{i}-category': self.category.id,
                f'faqs-{i}-question': faq.question,
                f'faqs-{i}-answer': faq.answer,
                f'faqs-{i}-DELETE': '',
            })

        self.mock_qdrant.reset_mock()
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 302)

        # Verify category was moved
        self.category.refresh_from_db()
        self.assertEqual(self.category.knowledgebase, new_kb)

        # Verify all FAQs are now in the new knowledgebase
        for faq in faqs:
            faq.refresh_from_db()
            self.assertEqual(faq.category.knowledgebase, new_kb)

        # Verify Qdrant operations
        # Should delete all FAQs from old KB
        delete_calls = [
            call(self.knowledgebase.id, f"faq-{faq.id}")
            for faq in faqs
        ]
        self.mock_qdrant.delete_by_reference_id.assert_has_calls(delete_calls, any_order=True)
        self.assertEqual(self.mock_qdrant.delete_by_reference_id.call_count, len(faqs))

        # Should insert all FAQs into new KB
        self.assertEqual(self.mock_qdrant.smart_upsert.call_count, len(faqs))

        # Verify each document was inserted into the new KB collection
        for faq, call_args in zip(faqs, self.mock_qdrant.smart_upsert.call_args_list):
            # Verify KB ID
            kb_id_arg = call_args[0][0]
            self.assertEqual(kb_id_arg, new_kb.id)

            # Verify document content
            expected_text = f"{faq.question}\n\n{faq.answer}"
            self.verify_qdrant_document(call_args, expected_text, faq.id)
