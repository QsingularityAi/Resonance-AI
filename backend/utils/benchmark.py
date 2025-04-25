import os

from django.conf import settings
from django.http import Http404, HttpResponse


def download_pdf(request, filename):
    # Define the path to the documents directory
    documents_dir = os.path.join(settings.BASE_DIR, 'benchmark_data', 'documents')

    # Construct the full file path
    file_path = os.path.join(documents_dir, filename)

    # Check if the file exists
    if not os.path.exists(file_path):
        raise Http404("File does not exist")

    # Open the file in binary mode
    with open(file_path, 'rb') as pdf_file:
        # Create a response object with the file content
        response = HttpResponse(pdf_file.read(), content_type='application/pdf')
        # Set the Content-Disposition header to make the file downloadable
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response