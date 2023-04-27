# Search

## Query Expressions

`gem5 Vision` supports the following query expressions:

- `category:<category_name>`: Searches for Resources filtered by the categories present [here](https://gem5vision.github.io/gem5-resources-website/category).
- `architecture:<architecture_name>`: Searches for Resources filtered by the architectures supported by gem5.
- `versions:<version_name>`: Searches for Resources that are supported in the particular version of gem5.
- `tags:<tag_name>`: Searches for Resources that have the searched tag.

Additionally, these query expressions can be piped. The logic for piping is explained in [filters](#filters).

## Filters

The Search UI also supports filters. On a wide screen, the filter options would appear on the left of the search results. On a non-wide screen the filters would appear on top of the search results in the middle of the screen.

- To filter by a specific category, expand the **category** section and select the category you're looking for.
- To filter by Architecture, under the Architecture section, select all the architectures you are simulating.
- To filter packages containing a specific version, expand the versions section and select the gem5 version you're using.
- Additionally, you can use all of these filters by using [query expressions](#query-expressions).

When searching for resources using multiple filters of different types, the filters are combined using the `AND` logical operator. This means that only resources that satisfy all the filters will be returned in the search results.

On the other hand, when filtering by multiple values within the same filter type, the filters are combined using the `OR` logical operator. This means that resources that match at least one of the values in the filter will be returned in the search results.

For example, filtering by `category:kernel` and `architecture:X86` will return only resources that belong to the kernel category and are supported by the X86 architecture. However, filtering by `category:kernel` and `category:bootloader` will return all resources that belong to the kernel category or the bootloader category.

## Sorting

When you search for a resource, the search algorithm first applies the [filters](#filters), and then uses a combination of the following parameters to find the most relevent results.

- Resource Name
- Resource Description
- Parameters
- Tags

These are all the sorting options available:

- Relevance
  - Best matches the search query
- Date
  - Data when the resource was published
- Version
  - Newest to oldest version introduced in ([dev, 22.1] > [dev, 22.1, 22.0])
- Resource ID Ascending
  - Dictionary order A->Z
- Resource ID Descending
  - Disctionary order Z->A
