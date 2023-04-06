# Schema Information

Here is what we are using to generate UML diagrams: [Plant UML](https://plantuml.com).

Here are the fields in both the JSON and MongoDB and what they are:

- `additional_metadata`: A JSON object that contains information like root_parition, simpoint_interval and warmup_interval, which are passed onto a resource in its initialization.

- `additional_params`: A JSON object that contains information like arguments and region_id, which are passed onto a resource in its initialization.

- `architecture`: A string that indicates the ISA of the resource.

- `author`: An array of strings that contains the names of the authors who created the resource. Extracted from GitHub src of gem5-resources.

- `category`: A string that describes the category of the resource. Created categories.

- `code_examples`: An array of objects that contain example code and a boolean value indicating whether the code has been tested. Extracted from GitHub src of gem5/configs and gem5/tests.

- `description`: A string that provides a description of the resource.

- `download_url`: A string that provides a URL for downloading the resource hosted on [dist.gem5.org](dist).

- `function`: A string that describes the function of the resource.

- `github_url`: A string that provides the URL for the resource's GitHub repository containing the source code.

- `id`: A string that provides a unique identifier for the resource.

- `is_tar_archive`: A boolean value indicating whether the resource is a tar archive.

- `is_zipped`: A boolean value indicating whether the resource is zipped.

- `license`: A string that describes the license under which the resource is released. Extracted from the metadata of the readme file of the resource's GitHub repository.

- `md5sum`: A string that provides the MD5 checksum of the resource.

- `name`: A string that provides a name for the resource.

- `resources`: A JSON object that contains information about the resource's binary, bootloader, checkpoint, disk_image, kernel, looppoint, and simpoint.

- `source`: A string that describes the source of the resource inside the gem5-resources repository.

- `tags`: An array of strings that provide tags for the resource.

- `usage`: A string that provides information about how the resource should be used. It contains a code block that shows how to use the resource.

- `versions`: An array of objects that contain information about the resource's different versions, including their size, download URL, and version number.
