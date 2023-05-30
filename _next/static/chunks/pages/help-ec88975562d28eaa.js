(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[233],{6886:function(e,r,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/help",function(){return t(4830)}])},4830:function(e,r,t){"use strict";t.r(r),t.d(r,{default:function(){return g}});var n=t(5893),s=t(682),i=t(4741),o=t(8394),a=t(9232),l=t(4996),c=t(9721),h=t(3398),u=t(4800),f=t(9008),d=t.n(f);function g(){return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(d(),{children:(0,n.jsx)("title",{children:"Help | gem5 Resources"})}),(0,n.jsx)(s.Z,{children:(0,n.jsx)(i.D,{className:"markdown-body mt-3",rehypePlugins:[[l.Z,{ignoreMissing:!0}],h.Z,c.Z],remarkPlugins:[o.Z,a.Z,u.Z],children:"# Search\n\n## Query Expressions\n\n`gem5 Vision` supports the following query expressions:\n\n- `category:<category_name>`: Searches for Resources filtered by the categories present [here](https://gem5vision.github.io/gem5-resources-website/category).\n- `architecture:<architecture_name>`: Searches for Resources filtered by the architectures supported by gem5.\n- `versions:<version_name>`: Searches for Resources that are supported in the particular version of gem5.\n- `tags:<tag_name>`: Searches for Resources that have the searched tag.\n\nAdditionally, these query expressions can be piped. The logic for piping is explained in [filters](#filters).\n\n## Filters\n\nThe Search UI also supports filters. On a wide screen, the filter options would appear on the left of the search results. On a non-wide screen the filters would appear on top of the search results in the middle of the screen.\n\n- To filter by a specific category, expand the **category** section and select the category you're looking for.\n- To filter by Architecture, under the Architecture section, select all the architectures you are simulating.\n- To filter packages containing a specific version, expand the versions section and select the gem5 version you're using.\n- Additionally, you can use all of these filters by using [query expressions](#query-expressions).\n\nWhen searching for resources using multiple filters of different types, the filters are combined using the `AND` logical operator. This means that only resources that satisfy all the filters will be returned in the search results.\n\nOn the other hand, when filtering by multiple values within the same filter type, the filters are combined using the `OR` logical operator. This means that resources that match at least one of the values in the filter will be returned in the search results.\n\nFor example, filtering by `category:kernel` and `architecture:X86` will return only resources that belong to the kernel category and are supported by the X86 architecture. However, filtering by `category:kernel` and `category:bootloader` will return all resources that belong to the kernel category or the bootloader category.\n\n## Sorting\n\nWhen you search for a resource, the search algorithm first applies the [filters](#filters), and then uses a combination of the following parameters to find the most relevent results.\n\n- Resource Name\n- Resource Description\n- Parameters\n- Tags\n\nThese are all the sorting options available:\n\n- Relevance\n  - Best matches the search query\n- Date\n  - Data when the resource was published\n- Version\n  - Newest to oldest version introduced in ([dev, 22.1] > [dev, 22.1, 22.0])\n- Resource ID Ascending\n  - Dictionary order A->Z\n- Resource ID Descending\n  - Disctionary order Z->A\n"})})]})}}},function(e){e.O(0,[991,774,888,179],function(){return e(e.s=6886)}),_N_E=e.O()}]);