# GraphQL Crawler

This Django app provides functionality to crawl GraphQL APIs, convert the retrieved data to markdown, and store it in MongoDB for use in the RAG system.

## Features

- Define GraphQL resources in the admin interface
- Execute GraphQL queries against external APIs
- Convert JSON responses to markdown format
- Store the markdown content in MongoDB
- Trigger crawling via Celery tasks

## Architecture

The GraphQL crawler is designed with a modular architecture that separates concerns and follows the Single Responsibility Principle:

### Models

- `GraphQlResource`: Stores information about a GraphQL API endpoint, including the URL, headers, query, field mappings, and response structure configuration.

### Services

#### GraphQL Retrieval
- `GraphQLClient`: Handles HTTP communication with GraphQL APIs.
- `GraphQLResponseParser`: Extracts structured data from GraphQL responses.
- `GraphQLRetriever`: Orchestrates the retrieval process using the client and parser.

#### Markdown Conversion
- `MarkdownConverter`: Base class for markdown converters.
- `DictionaryMarkdownConverter`: Converts dictionary data to markdown.
- `ListMarkdownConverter`: Converts list data to markdown.
- `MarkdownConverterFactory`: Creates the appropriate converter based on data type.
- `FieldMapper`: Applies custom field mappings to control how data is converted to markdown.

#### Document Processing
- `DocumentCreator`: Creates MongoDB documents from processed data.
- `GraphQLProcessor`: Orchestrates the processing of retrieved data.

### Tasks

- `retrieve_graphql_data`: Celery task that orchestrates the retrieval and processing of GraphQL data.

## Usage

### Admin Interface

1. Navigate to the Django admin interface
2. Go to "GraphQL Resources" under the "Graphql" section
3. Create a new GraphQL resource:
   - Enter a name for the resource
   - Specify the GraphQL API URL
   - Select a knowledgebase (optional)
   - Enter the GraphQL query
   - Add any required headers (e.g., authentication)
4. Save the resource - this will automatically trigger the crawling process

### Triggering Crawls

Crawls are automatically triggered when:
- A new GraphQL resource is created
- The query of an existing resource is modified

You can also manually trigger crawls in several ways:
1. Click the "Start Crawl" button in the list view next to each resource
2. Click the "Start Crawl Now" button in the detail view of a resource
3. Select one or more resources in the admin list view and choose "Trigger crawl for selected resources" from the actions dropdown

### Testing

A management command is provided for testing the GraphQL crawler:

```bash
# Test with an existing resource
python manage.py test_graphql_crawler --resource-id=1

# Create and test a sample resource (GitHub API)
python manage.py test_graphql_crawler --create-test --knowledgebase-id=1
```

## Response Structure Configuration

The GraphQL crawler supports configuring how to extract items from the GraphQL response structure. This is particularly useful for handling GraphQL APIs that use the edges/node pattern common in Relay-style pagination.

### Unwrapping Nodes

Many GraphQL APIs return data in a structure like:

```json
{
  "data": {
    "products": {
      "edges": [
        {
          "node": {
            "id": "1",
            "name": "Product 1",
            "description": "Description 1"
          }
        },
        {
          "node": {
            "id": "2",
            "name": "Product 2",
            "description": "Description 2"
          }
        }
      ]
    }
  }
}
```

In this case, you can set the `unwrap_node_field` to `node` in the admin interface. This will extract the contents of each node object as a separate item, rather than treating the entire edge object as an item.

This means that instead of processing items like:

```json
{
  "node": {
    "id": "1",
    "name": "Product 1",
    "description": "Description 1"
  }
}
```

The system will process items like:

```json
{
  "id": "1",
  "name": "Product 1",
  "description": "Description 1"
}
```

This makes it much easier to work with the data, especially when configuring field mappings.

## Field Mappings

The GraphQL crawler supports custom field mappings to control how data is converted to markdown. This is particularly useful for handling different GraphQL APIs with varying data structures.

### Configuring Field Mappings

Field mappings are configured in the admin interface under the "Field Mappings" section of a GraphQL resource. The mappings are stored as a JSON object with the following structure:

```json
{
  "title_field": "name",
  "image_fields": ["thumbnail", "image"],
  "link_fields": {
    "url": "https://example.com/{path}",
    "product_url": "https://example.com/products/{id}"
  },
  "date_fields": ["created_at", "updated_at"],
  "ignore_fields": ["internal_id", "metadata"],
  "custom_formatters": {
    "price": "**Price**: ${value} USD"
  },
  "base_url": "https://example.com"
}
```

### Available Mapping Options

- **title_field**: Specifies which field to use as the title for the markdown document. Supports dot notation for nested fields (e.g., "product.name").
- **image_fields**: A list of fields that contain image URLs. These will be converted to markdown image syntax.
- **complex_image_paths**: A dictionary mapping field names to complex path expressions for extracting image URLs from nested structures, including arrays.
- **multi_image_arrays**: A dictionary mapping field names to configurations for processing multiple images from arrays.
- **link_fields**: A dictionary mapping field names to URL templates. The templates can include placeholders for field values.
- **date_fields**: A list of fields that contain dates. These will be formatted according to the date_format setting.
- **ignore_fields**: A list of fields to exclude from the markdown output.
- **custom_formatters**: A dictionary mapping field names to custom format strings. The format strings can include placeholders for field values.
- **base_url**: The base URL to use for relative URLs in image and link fields.
- **static_url**: A static URL prefix to prepend to image paths.
- **date_format**: The format string to use for formatting dates (default: "%Y-%m-%d").

### Examples

#### Image Fields

For a field "thumbnail" with value "/images/product.jpg", the markdown will be:

```markdown
![Thumbnail](https://example.com/images/product.jpg)
```

#### Complex Image Paths

For handling images in nested structures or arrays, use the `complex_image_paths` option:

```json
{
  "complex_image_paths": {
    "node": "images[0].img1.fullpath"
  },
  "static_url": "https://static.example.com"
}
```

This will extract the image path from `node.images[0].img1.fullpath` and prepend the static URL:

```markdown
![Node](https://static.example.com/path/to/image.jpg)
```

The path expression supports:
- Dot notation for nested fields: `node.images`
- Array indices: `images[0]`
- Multiple levels: `node.images[0].img1.fullpath`

#### Multiple Images from Arrays

For processing multiple images from an array, use the `multi_image_arrays` option:

```json
{
  "multi_image_arrays": {
    "gallery": {
      "array_path": "node.images",
      "item_path": "img1.fullpath",
      "limit": 3
    }
  },
  "static_url": "https://static.example.com"
}
```

This will:
1. Extract the array from `node.images`
2. For each item in the array (up to the limit of 3), extract the image path from `img1.fullpath`
3. Generate markdown for each image with numbered alt text:

```markdown
![Gallery 1](https://static.example.com/path/to/image1.jpg)

![Gallery 2](https://static.example.com/path/to/image2.jpg)

![Gallery 3](https://static.example.com/path/to/image3.jpg)
```

The configuration options are:
- **array_path**: Path to the array containing the images
- **item_path**: Path within each array item to the image URL
- **limit**: Maximum number of images to process (0 for all)

#### Real-World Example: Nested Image Objects

For a GraphQL API that returns images in a structure like this:

```json
{
  "node": {
    "images": [
      {
        "image": {
          "id": "1590",
          "fullpath": "/DILO/Products/V-Teile/AG/ca-vk-fl-01-20-m50%20-%201043554.jpg",
          "filename": "ca-vk-fl-01-20-m50 - 1043554.jpg",
          "modificationDate": 1739190000,
          "mimetype": "image/jpeg",
          "type": "image",
          "filesize": 232449
        }
      }
    ]
  }
}
```

You would use this configuration:

```json
{
  "multi_image_arrays": {
    "product_images": {
      "array_path": "node.images",
      "item_path": "image.fullpath",
      "limit": 0
    }
  },
  "static_url": "https://example.com",
  "unwrap_node_field": "node"
}
```

This configuration:
1. Uses `unwrap_node_field` to extract the contents of each node (set in the admin interface)
2. Processes all images in the `images` array (limit: 0)
3. For each item, extracts the image path from `image.fullpath`
4. Prepends the static URL to create complete image URLs
5. Generates markdown for each image with numbered alt text:

```markdown
![Product Images 1](https://example.com/DILO/Products/V-Teile/AG/ca-vk-fl-01-20-m50%20-%201043554.jpg)

![Product Images 2](https://example.com/DILO/Products/V-Teile/AG/ca-vk-fl-01-20-m50-2.jpg)
```

#### Direct List Values

The system also supports cases where the field value is directly a list of image objects:

```json
[
  {
    "image": {
      "id": "1297",
      "fullpath": "/DILO/Products/SF6/Mit%20Hintergrund/Gasnachf%C3%BCll-%20und%20Evakuierger%C3%A4te/3-001-4-r022-r122-evakuier-und-nachf%C3%BCllger%C3%A4t-mit-elektronischer-wiegeeinrichtung.jpg",
      "filename": "3-001-4-r022-r122-evakuier-und-nachfüllgerät-mit-elektronischer-wiegeeinrichtung.jpg",
      "modificationDate": 1721651697,
      "mimetype": "image/jpeg",
      "filesize": 211516,
      "type": "image"
    }
  }
]
```

In this case, you would still use the same configuration:

```json
{
  "multi_image_arrays": {
    "images": {
      "array_path": "images",
      "item_path": "image.fullpath",
      "limit": 3
    }
  },
  "static_url": "https://example.com"
}
```

The system will detect that the value is already a list and use it directly, ignoring the `array_path` parameter. This is particularly useful when the GraphQL API returns a field that is already an array of image objects.

#### Link Fields

For a field "product_url" with a template "https://example.com/products/{id}" and a value of {"id": "123"}, the markdown will be:

```markdown
[Product Url](https://example.com/products/123)
```

#### Custom Formatters

For a field "price" with a custom formatter "**Price**: ${value} USD" and a value of 19.99, the markdown will be:

```markdown
**Price**: $19.99 USD
```

## Integration with RAG

The GraphQL crawler integrates with the RAG system by:
1. Converting GraphQL data to markdown format with customizable field mappings
2. Storing the markdown in MongoDB collections based on the knowledgebase
3. Creating QSource objects that can be used by the RAG system

## Development

### Adding New Features

To extend the GraphQL crawler:

1. **GraphQL Client Enhancements**:
   - Add support for additional authentication methods
   - Implement request retries or circuit breakers
   - Add support for GraphQL subscriptions

2. **Markdown Conversion Improvements**:
   - Create specialized converters for specific data types
   - Enhance formatting for better readability
   - Add support for additional markdown features (tables, code blocks, etc.)

3. **Admin Interface Extensions**:
   - Add preview functionality for GraphQL queries
   - Implement scheduling for periodic crawling
   - Add monitoring and statistics for crawled data

### Testing

The application includes comprehensive unit tests for all components:

```bash
# Run all tests
python manage.py test graphql

# Run specific test classes
python manage.py test graphql.tests.GraphQLClientTests
python manage.py test graphql.tests.MarkdownConverterTests

# Test with the management command
python manage.py test_graphql_crawler --resource-id=<id>
```
