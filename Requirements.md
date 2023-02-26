# Requirements Doc v1.5

## Team 11 (The Spidermen)

### Authors

- Kunal Pai
- Parth Shah
- Harshil Patel
- Arslan Ali

## Introduction

gem5 is a simulation software used by computer architects both in academia and the industry. Being a simulator, it also provides certain Resources relevant to computer architecture, like Kernels, Bootloaders, Benchmarks, and Disk Images to its users. Currently, the Resources are stored in a Google Cloud Bucket. The only way a user of gem5 can access information regarding which Resources exist is by going through the resources.json file available [here](https://gem5.googlesource.com/public/gem5-resources/+/refs/heads/stable/resources.json) manually, which can be cumbersome. Our main goal is to make *finding Resources easier for gem5 users and integrating it with other components of the gem5 ecosystem*. Part of this goal involves categorizing the available Resources and making these Categories and Groups filtrable, and creating compatibility links between existent Resources. It also involves linking a Resource with example code from the gem5 source code, and also linking it with README files present in the gem5_resources repository. Another aspect of this project is to use a server to track analytics of various Resources.

But, on top of that, to make the user experience better, additional goals include adding a beginners’ section for first-time users of gem5 and adding more information within the frontend rendering and the backend data of a particular Resource page. This information is meant to help users and includes input size, expected output, logging for particular benchmarks within the suite that do not work, dependencies, version compatibilities (with different versions of gem5), download sizes, direct download links for the Resource, and if the Resource is tested or not.

To make the administration of Resources better, additional goals involve integrating MongoDB into the current Python wrapper that downloads Resources.

## Technology Survey

### Backend

- Django
  - Django is a high-level Python web framework that enables the rapid development of secure and maintainable websites.
  - Pros:
    - Security
    - Scalability
    - Open-Source with community
  - Cons:
    - Slower performance
    - Need time to learn
    - Resource-intensive
- Flask
  - Flask is a lightweight and flexible Python web framework that provides useful tools and features for building web applications.
  - Pros
    - RESTful request dispatching
    - Support for secure cookies
    - Easily deployable
    - A granular level of control
    - We have experience with Flask
  - Cons:
    - Limited support from the community
    - High maintenance costs for all resources
    - More work than Django to set up
- ExpressJs
  - Express.js is a fast, minimalist web framework for Node.js that provides a robust set of features for building web applications and APIs.
  - Pros
    - Lightweight, Fast, and flexible
    - Integration with databases
    - Single Language stack (Js)
    - Largest user base
    - We have experience with ExpressJs
  - Cons
    - Possible issues for a large dataset like gem5 resources
    - Single-threaded and might run into issues with 1000+ users
- Jekyll
  - Jekyll is a static site generator written in Ruby that transforms plain text into a website and supports themes, posts, and other features commonly used in blogs and websites.
  - Pros
    - Fast
  - Cons
    - Does not support dynamic features like server-side processing and databases, both crucial to the project

### Database

- MongoDB
  - MongoDB is a document-oriented NoSQL database that provides high scalability, performance, and flexibility for storing and processing large volumes of data.
  - Pros:
    - High-performance and best-in-class security
    - Operated on-premise or in the cloud
    - Scalable
    - Better Security (Power over who can access)
    - We have experience with using MongoDB
  - Cons:
    - Joining 2 documents is difficult and can lead to duplicates
    - A limited size of only 16 MB for a document
- Firebase
  - Firebase is a Backend-as-a-Service (BaaS) platform that provides real-time data storage, authentication, and static hosting for building and scaling web and mobile applications.
  - Pros:
    - Easy to setup (Requires less prior knowledge)
    - Great for real-time data
    - Best for mobile app development
    - We have experience with using Firebase
  - Cons:
    - Cloud only (No control over how it is hosted)
    - Currently supports only a small number of languages
- SQLite
  - SQLite is a software library that provides a relational database management system and is widely used as the embedded database software for local/client storage in application software such as web browsers, mobile devices, and desktop applications.
  - Pros:
    - Control over the database (File based)
    - Faster performance since rests with the server
    - We have experience with using SQLite
  - Cons:
    - Security is not that good
    - Requires more work for horizontal scaling

### Frontend

- Vanilla HTML/CSS/JavaScript
  - Vanilla HTML, CSS, and JavaScript refer to using the standard, unmodified, and unenhanced versions of the HTML, CSS, and JavaScript languages to create web pages and applications without relying on any additional libraries, frameworks, or platforms.
  - Pros
    - Easier for people with no prior experience with web development
  - Cons
    - Harder for 4 people to work on a single codebase
    - Libraries are harder to integrate
- ReactJs
  - React.js is a JavaScript library for building user interfaces that provide an efficient, declarative, and flexible approach to updating and rendering components in response to changes in data.
  - Pros
    - Better for handling different UI updates (virtual DOM)
    - Easier to test with different libraries
    - One of the most popular JavaScript frameworks
    - Has pre-existing classes for NavBars, etc. which makes HTML development easy
    - We have experience with using ReactJs
  - Cons
    - Requires additional libraries and tools to build a full-featured web application
    - Steep learning curve for developers unfamiliar with its syntax and concepts
- AngularJs
  - Angular.js is a JavaScript-based open-source front-end web application framework mainly maintained by Google and used for building single-page applications and dynamic web pages.
  - Pros
    - Provides a comprehensive framework with a large set of built-in features and tools for building complex web applications
    - Offers a strong structure for organizing and scaling applications
    - Uses two-way data binding for efficient and reactive updates to the user interface
  - Cons
    - A steep learning curve for developers unfamiliar with its syntax and concepts
    - Can be slower for applications with large amounts of data
    - Heavier and less flexible compared to other frameworks and libraries

Conclusion: ReactJS

### Hosting

- AWS
  - EC2 Cluster + ELB + Docker
  - Amazon Web Services (AWS) Elastic Compute Cloud (EC2) combined with Elastic Load Balancer (ELB) is a scalable and highly available cloud computing platform that provides secure and efficient computing resources and load balancing for deploying and managing applications.
  - Pros
    - Scalable and flexible computing resources, allowing for easy scaling of applications as needed
    - Load balancing capability, providing automatic distribution of incoming traffic for improved performance and reliability
    - Integration with other AWS services, providing a comprehensive solution for deploying and managing applications
    - Wide range of operating system and application support, allowing for a variety of use cases
    - High availability through multiple availability zones and automatic failover
  - Cons
    - Complexity in managing and configuring instances and load balancers
    - Cost, as AWS services can be more expensive compared to other cloud providers
    - Potential security concerns, as with any cloud-based solution
    - Dependence on the AWS infrastructure and service availability
    - The need for technical expertise and experience to effectively utilize and manage EC2 and ELB instances.
- Google Cloud
  - Kubernetes Engine cluster + Docker Container
  - Google Cloud Platform (GCP) Kubernetes Engine cluster combined with Docker Container is a powerful and efficient platform for deploying and managing containerized applications, providing automatic scaling, orchestration, and management of containers through a managed Kubernetes cluster.
  - Pros
    - Easy to manage and scale containerized applications, with automatic orchestration and management provided by Kubernetes
    - Integration with other GCP services, providing a comprehensive solution for deploying and managing applications
    - High availability through automatic failover and node replacement
    - Secure, with built-in security features and the ability to integrate with existing security tools and processes
    - Cost-effective, with flexible pricing options and the ability to quickly and easily scale resources as needed
  - Cons
    - Steep learning curve for those unfamiliar with Kubernetes and container orchestration
    - Dependence on the GCP infrastructure and service availability
    - Complexity in managing and configuring clusters and containers
    - Potential security concerns, as with any cloud-based solution
    - Need for technical expertise and experience to effectively utilize and manage Kubernetes Engine clusters.
- Local hosting
  - Pros
    - Full control over the hosting environment, including the operating system, hardware, and network configuration
    - Cost savings, as there are no ongoing hosting fees or charges
    - Easy to customize and configure, as you have direct access to the hosting environment
    - Improved performance, as the website or application is hosted on a dedicated machine and is not sharing resources with other websites or applications
  - Cons
    - Limited scalability, as the capacity of the hosting environment is limited to the available hardware resources
    - Maintenance and security responsibilities, as the local host is responsible for managing and securing the hosting environment
    - Lack of reliability and uptime, as the hosting environment is vulnerable to power outages, hardware failures, and other issues that can affect its availability
    - Difficulty in accessing the hosting environment remotely, as it is only accessible within the local network
    - Limited technical support, as the host is responsible for resolving any technical issues that may arise.
- Heroku
  - Heroku is a cloud platform as a service (PaaS) that enables developers to deploy, run, and manage web applications and services, without the need to manage underlying infrastructure.
  - Pros
    - Easy to use and deploy, with a user-friendly platform and a simple Git-based deployment process
    - Scalability, with the ability to easily and quickly scale resources as needed
    - No infrastructure management, freeing up time and resources to focus on the development of the application
    - Large community, with a wealth of resources and support available for developers
    - Integration with other tools and services, such as add-ons and partner solutions, for added functionality and convenience
  - Cons
    - Limited control over the underlying infrastructure, with limited customization options and configurations
    - Cost, as resources are billed based on usage and can become expensive as the application grows
    - Performance limitations, as the performance of the application, is dependent on the underlying hardware and network infrastructure
    - Vendor lock-in, as it can be difficult to migrate the application to another platform or infrastructure
    - Dependency on a reliable internet connection, as the application and its data, are hosted on remote servers.
- Serverless
  - Pros
    - Cheapest
    - Easy to maintain
  - Cons
    - Security (If using MongoDB then not possible to store client secrets)
    - Scalability
    - Would need to rewrite from scratch if decided to change the architecture

### Project Management

- Notion
  - Pros
    - Versatile: Notion allows for creating notes, task lists, and databases, which can be used for a variety of purposes.
    - Collaboration: Notion makes it easy to share notes with others and collaborate in real time.
    - Customizable: Notion allows for creating custom templates, adding images and other media, and using a variety of formatting options.
    - Mobile app: Notion has a mobile app that allows for accessing and editing notes on the go.
    - Integration: Notion can be integrated with other tools such as Trello, Google Drive, and Slack.
  - Cons
    - Cost: Notion's free plan has some limitations, and the paid plans can be expensive for personal use.
    - Learning curve: Notion has a lot of features, and it can take some time to learn how to use them effectively.
    - Dependency: Notion is a cloud-based tool, so users are dependent on the internet and Notion's servers for accessing their notes.
- GitHub Organization
  - Pros
    - Collaborative development: GitHub Organizations allow multiple users to work on the same codebase and contribute to the same repositories.
    - Access control: Organizations provide granular access control, allowing for fine-grained permission management for each repository.
    - Centralized management: Organizations provide a centralized management interface for managing multiple repositories, users, and teams.
    - Community building: Organizations can be used to build a community around a project or a company, making it easier to coordinate with external contributors and contributors from other teams.
  - Cons
    - Complexity: Organizations can be more complex than personal GitHub accounts, and it can take some time to learn how to use them effectively.
    - Cost: While creating an organization is free, some features such as private repositories and team management are only available on paid plans, which can be expensive for small teams or personal use.
    - Dependency: Organizations are cloud-based, so users are dependent on the internet and GitHub's servers for accessing their repositories.

## Tech Stack

- **Frontend**: React (w/ NextJS as the framework)
- **Database**: MongoDB + JSON
- **Backend**: Analytics Server
- **API Wrapper**: Python
- **Website Hosting**: GitHub Pages
- **Code**: GitHub Organization
- **Project Management**: Notion + Google Drive

## System Architecture Overview

    ```mermaid
    graph TD;
        A[dev] --> B[JSON];
      C[v22.1] --> B[JSON];
        D[v22.0] --> B[JSON];
        E[v21.2] --> B[JSON];
      F[gem5/gem5_resources] --> I[gem5 Vision]
       G[gem5/configs/gem5_library] --> I[gem5 Vision]
      B[JSON] --> H[MongoDB]
      B[JSON] --> I[gem5 Vision]
      H[MongoDB] --> I[gem5 Vision]
      J[Server to Track Stats] --> I[gem5 Vision]
       K[gem5 prebuilt boards] -.-> I[gem5 Vision]
        I[gem5 Vision] --> L[gem5 Resources Website]
        I[gem5 Vision] --> M[Documentation]
        I[gem5 Vision] --> N[Python Wrapper]
        L[gem5 Resources Website] --> M[Documentation]
    ```

## Requirements

**User Stories #1: Documentation for a Resource**

Problem: Dr. Finn is a seasoned gem5 researcher who knows the exact ID of the resource he wants to download, down to the architecture, category, and whether he requires SimPoints or not. But, he forgot how to use a resource in gem5.

Solution: All he needs is, therefore, a search bar, where he can enter the ID of the required resource and see the instructions on how to use it in gem5.

**User Stories #2: Advanced Exact Search**

Problem: Dr. Bose is a researcher who requires a particular version of a resource for a particular architecture for a particular release of gem5.

Solution: Therefore, he needs an advanced feature search where they can filter all the resources by their versions, and architectures, and check out instructions for a particular version of gem5.

**User Stories #3: Browsing a Category**

Problem: Professor Lev Bronstein has a simulation setup for RISC-V. He has everything ready now he is trying to look for different Kernels supported by his architecture.

Solution: He can select the category Kernels and filter by RISC-V to check what’s available (under “Advanced Search”).

**User Stories #4: Link to Resource Dependencies**

Problem: Dr. Allison is working on code written by a researcher who no longer works with them. The researcher used some workloads but they don’t know what it does and what it depends upon.

Solution: They know the exact ID for the workload. They need to search the ID for the resources and click on the resources it depends upon.

**User Stories #5: Partial Search**

Problem: Dr. Caroline Bracey is trying to find the Linux kernel (v4.19.83) for x86 systems but they don’t know the exact ID for it. Now she wants to find the ID for it so that they can use it for their x86 simulation.

Solution: Here, she can use the advanced search, select the category as Kernel, Filter by x86 architecture, Filter from “Date Oldest to Newest”, and search for Linux v4.19.83.

OR

Search for Linux v4.19.83, if not satisfied with the results, use the advanced search and choose the category as Kernel, apply the x86 filter, and sort by “Date Oldest to Newest”.

**User Stories #6: Compatibility and Versioning**

Problem: Dr. Kevin Patel recently updated to the new Gem5 version and now are trying to run a simulation that uses the riscv-bootloader-vmlinux-5.10. However, they’re running into compatibility issues since the bootloader was designed for an older version.

Solution: The user now searches for id and views all of the versions for the bootloader and if there is a version that the newest version of gem5 supports. Something similar to [https://pub.dev/packages/flutter_native_splash/versions](https://pub.dev/packages/flutter_native_splash/versions)

**User Stories #7: Examples of How to Use**

Problem: Neha Kakkar is a researcher who wants to run NAS Parallel Benchmark for a particular system to gem5 but does not know how to use that resource for a particular mode of gem5 (SE or FS).

Solution: Therefore, they need particular instructions for using that resource in SE mode and in FS mode on viewing more information about the resource.

**User Stories #8: Filtering based on SimPoints/checkpoints**

Problem: Professor Jennifer Drakos wants to speed up her simulation time. She would need to pick the exact same resource, down to the gem5 version, resource version, architecture, etc. but just a version with SimPoints or CheckPoints.

Solution: Therefore, she needs a checkbox that can toggle between showing all resources or just resources that support SimPoints or CheckPoints.

**User Stories #9: Seeing Information about a Resource**

Problem: Dr. Harshil is trying to run a simulation for a benchmark suite under RISC-V but gem5 is throwing errors when he loads the benchmark into his code.

Solution: Having documentation with a Resource that lists expected output, input files for the resource, logging for particular benchmarks within the suite that do not work, dependencies and version compatibilities can help the user debug the problem within the resource easier.

**User Stories #10: Existence of filtering by “Groups”**

Problem: Dr. Bao wants to find assembly tests for RISC-V but filtering by “Test” gives a huge number of binaries, and the ID of the resource does not contain “asmtest”, so searching via the search bar does not give an accurate result either.

Solution: Having a group that lists all the Linux kernels, hello tests, print-this binaries and assembly tests can help a user find all versions for all members of these respective groups so that searches that cannot be indexed can still be found.

**User Stories #11: Link to Beginners’ Tutorial**

Problem: Walter Goodman is a beginner to gem5. He does not know what resources are or how to use them in gem5.

Solution: A link to the most commonly used or the most beginner-friendly resources on the homepage would help him get started with using resources in gem5.

**User Stories #12: Change in Documentation**

Problem: Dr. Christina realizes that there is an error with the documentation provided along with a Resource on the website and knows how to fix that error.

Solution: Having a button on the documentation to automatically submit a PR would allow a user to fix it.

**User Stories #13: Filter by Tested**

Problem: Professor Zhuangzi wants to only use resources that have been officially tested by the gem5 community.

Solution: Implementing a verified badge for the resources that have been tested, and implementing a “filter by” option that can display those resources solves this problem.

**User Stories #14: Filter by Tested**

Problem: Dr. Bobby Bruce is the admin of gem5 and he wants to add a new Resource and fix an existing one.

Solution: Specialized CLI tool for Dr. Bruce just for maintaining and adding new Resources.

**User Stories #15: Direct Download**

Problem: Dr. Miyamoto wants to directly download an Image file from gem5 resources.

Solution: Having a Download button in the documentation of a resource that leads a user to the page where they can directly download the resource solves this problem.

### Functional Requirements

1. The website must allow users to search for resources related to gem5.
2. The website must display results according to the search criteria
3. The website must show the following information about each resource on its designated page:
    1. Readme/Documentation
    2. Architecture supported
    3. Author
    4. Date of publication
    5. Versions and Compatibility
    6. Usage (Example code)
    7. Dependencies
    8. Tags
4. The website must allow the users to sort the resources according to the following criteria
    1. Search relevance
    2. Date of publication
    3. Name
    4. gem5 Version
5. The website must allow the users to apply certain filters such as:
    1. Workloads
    2. Category
        1. Binaries
        2. Tests
        3. Kernels
        4. Benchmarks
        5. Disk Images
        6. Bootloaders
    3. Group
        1. linux-kernels
        2. print-this
        3. hello
        4. asmtest
    4. Architecture
        1. x86
        2. RISC-V
        3. ARM
        4. POWER
        5. SPARC
        6. MIPS
    5. Simpoints and/or Checkpoints
        1. Infrastructure to add more types
6. The website must allow a way for users to download the resources
7. The website must allow the users to view the dependencies for workloads
8. The website must allow the users to know the compatibility of resources with particular gem5 versions
9. Admins should be able to easily add and manage the resources displayed on the webpage
10. The Python wrapper must be adequately tested
11. Every piece of code should be well-documented
12. JSON and MongoDB should be delivered with schemas
13. API should be delivered with a design document that specifies how it works

### Non-Functional Requirements

1. The website must have a user-friendly design that is easy to navigate.
2. The search bar should provide fast and accurate results
3. The website must be scalable to support a large number of resources and users
4. The website must be responsive and able to handle a large number of screen sizes.
5. The website must be secure and should make sure that access is controlled
6. The website must be available 24/7 with minimal downtime
7. The website must load quickly and efficiently, even with a low connection or poor hardware
8. The website must be optimized for search engines, making it easy for users to find it
9. The Python wrapper must be as bug-free as possible
10. Documentation should follow gem5 standards

## Prototyping Code

Figma Mock-Up of Design Choices:

[https://www.figma.com/proto/KaXsLJajogOBxIxikxFV14/gem5-Resources?node-id=199%3A173&scaling=scale-down&page-id=199%3A172&starting-point-node-id=199%3A173&show-proto-sidebar=1](https://www.figma.com/proto/KaXsLJajogOBxIxikxFV14/gem5-Resources?node-id=199%3A173&scaling=scale-down&page-id=199%3A172&starting-point-node-id=199%3A173&show-proto-sidebar=1)

GitHub Organization where code will be pushed:

[gem5Vision](https://github.com/orgs/Gem5Vision/dashboard)

## Cost Analysis

**Option 1:  No server + ReactJs + JSON**

Advantages:

- Easy to transition from the current implementation
- Cheapest

Disadvantages:

- Harder to maintain once the number of resources increases
- Inefficient searches, will not be able to support search query expressions
- Difficult to scale up
- Difficult to implement time-efficient sorting and filtering since we’ll need to fetch the entire JSON for any operation

Cost: Hosting on GitHub Pages can give $0/month. Therefore, for our use case, the total cost will be ****************$0/month****************.

**Option 2:  No server + ReactJs + MongoDB**

Advantages:

- Can support search query expressions like:
  - “exact phrase”
  - category:Kernels
  - dependency:resource:”XYZ”: direct dependency
  - dependency*:resource:”XYZ”: indirect dependency

Disadvantages:

- Less secure since everything is happening client's side
- Not possible to scale up
- No flexibility, since once we decide on a methodology to fetch data, it is set in stone (No API calls)
- Search query expressions are supported, but having different API endpoints makes it easier to debug and serve data in different formats if required (link and JSON)

Cost: MongoDB is free up to 5GB storage of text data. For 1TB of storage, the price is $0.10 per million reads. Hosting on GitHub Pages can give $0/month. Therefore, for our use case, the total cost will be ****************$0/month****************.

**Option 3:  Cheap Server (Hosting: Heroku/Render.com)+ ReactJs + MongoDB**

Also used by similar projects like:

- Flutter pub.dev: [https://pub.dev](https://pub.dev/)
- Python pip: [https://pypi.org](https://pypi.org/), Explanation: [https://en.wikipedia.org/wiki/Pip_(package_manager)](https://en.wikipedia.org/wiki/Pip_(package_manager))

Advantages:

It provides the following advantages on top of those provided by Option 2:

- Can reuse code for both website and python wrapper
- Can easily modify API endpoints later if needed
- Makes it easier to debug and serve data in different formats if required
- If we want to extend to user-uploaded resources, a server is necessary for authentication
- Greatly increases the security: Most of the processing is server side and thus not much is visible to the end user
- Can easily scale this to AWS EC2+ELB later

Disadvantages:

- Might involve a bit of work to horizontally scale
- Cannot expand to multiple regions

Cost: [Render.com](http://Render.com) is free. Heroku is $5 and limited to 1000 dyno-hours (hours of API used) a month. Unlimited at a basic tier is $7 dollars an hour. Therefore, for our use case, the total cost will be ****************$0-7/month****************.

**Option 4:  AWS EC2 + Load Balancer (AWS Elastic Beanstalk) + ReactJs + DynamoDB (AWS-supported database)/MongoDB**

Advantages:

It provides the following advantages on top of those provided by Options 2 and 3:

- Can horizontally scale this infinitely
- Can expand to other regions too

Disadvantages:

- Expensive
- The learning curve to understand how it works

Cost: [https://aws.amazon.com/ec2/pricing/on-demand/](https://aws.amazon.com/ec2/pricing/on-demand/) - t4g.nano or t4g.micro. The price is $0.0042 an hour and $0.0084 an hour. Multiplying that by 24 hours for 31 days gives us an upper limit of $3.13/month to $6.25/month. Amazon LightSail is free for a year and then costs $3.50 a month. Therefore, for our use case, the total cost will be ****************$3.13-6.25/month****************.

## Social and Legal Aspects

gem5 is an open-source project under the BSD license. This implies that our project is open to receiving contributions from an entire community of gem5 users after its completion. On contributing to gem5, we will receive recognition either in the form of credit in the project's documentation or by being listed as a contributor on the website after our work is merged into the stable branch.

We will retain the copyright to the code we write for this project. Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

- redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer;
- redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution;
- neither the name of the copyright holders nor the names of its
    contributors may be used to endorse or promote products derived from
    this software without specific prior written permission

Our software is provided by our team "as is" and any express or implied warranties, including, but not limited to, the implied warranties of merchantability and fitness for a particular purpose are disclaimed. In no event shall our team be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, procurement of substitute goods or services; loss of use, data, or profits; or business interruption) however caused and on any theory of liability, whether in contract, strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this software, even if advised of the possibility of such damage.

Source:

*LICENSE - public/gem5 - Git at Google.* [https://gem5.googlesource.com/public/gem5/+/refs/heads/stable/LICENSE](https://gem5.googlesource.com/public/gem5/+/refs/heads/stable/LICENSE). Accessed 8 Feb. 2023.
