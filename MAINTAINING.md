# How to Maintain gem5 Resources Website

This document describes how to maintain the gem5 Resources website.
# Table of Contents

- [How to Maintain gem5 Resources Website](#how-to-maintain-gem5-resources-website)
- [Table of Contents](#table-of-contents)
- [Database Configuration](#database-configuration)
  - [`schemaUrl`](#schemaurl)
  - [`resources`](#resources)
- [Hosting on a Different Domain](#hosting-on-a-different-domain)
- [Adding a New Category](#adding-a-new-category)
- [Adding a New Page](#adding-a-new-page)
- [Configuring the Tabs](#configuring-the-tabs)
- [Editing Information on the Help page or About page](#editing-information-on-the-help-page-or-about-page)
- [Changing CSS](#changing-css)
- [Adding a JSON file as a Static Page](#adding-a-json-file-as-a-static-page)
- [Searching Resources](#searching-resources)
- [Testing Configurations](#testing-configurations)
  - [jest.config.js](#jestconfigjs)
    - [Configuration Details](#configuration-details)
    - [Running Jest](#running-jest)
  - [cypress.config.js](#cypressconfigjs)
    - [Configuration Details](#configuration-details-1)
    - [Running Cypress](#running-cypress)

# Database Configuration

The following extra environment variables are used in the main configuration file (`next.config.js`) and are added through `gem5.config.json`:

## `schemaUrl`

Description: The Raw GitHub URL of where the gem5 Resources Schema lies.

## `resources`

This is an object containing multiple key-value pairs representing different configurations for private resources used in the application.

In case of a **MongoDB** database, every object must contain the following properties:

- `dataSource`: The data source name.
- `database`: The database name.
- `collection`: The collection name.
- `url`: The URL of the MongoDB Data API endpoint.
- `name`: The name of the data source.
- `apiKey`: The API key for accessing the MongoDB data (read-only).
- `isMongo`: A boolean value indicating whether the data source is MongoDB or not, set to true.

In case of a **JSON** database, every object must contain the following properties:

- `url`: The Raw GitHub URL of the JSON data, or the local path, with root directory being the `public` directory of this codebase.
- `isMongo`: A boolean value indicating whether the data source is MongoDB or not, set to false.

# Hosting on a Different Domain

In order to host the website on a different domain, firstly you need to add a CNAME file to the `public` directory with the domain name as the content of the file. For example, if you want to host the website on `https://resources.gem5.org`, you need to add a file named `CNAME` to the `public` directory with the content `resources.gem5.org`.
Next, in order to load the static assets correctly, you need to change the `assetPrefix` and `basePath` properties in the `next.config.js` file. For example, if you want to host the website on `https://resources.gem5.org`, you need to change the `assetPrefix` and `basePath` properties to `undefined` and `/` respectively. If you want to host the website on `https://resources.gem5.org/gem5-resources`, you need to change the `assetPrefix` and `basePath` properties to `/gem5-resources/` and `/gem5-resources` respectively.

# Adding a New Category

1. If you want to add a new category, make sure it is added as a definition to the gem5 Resources Schema.

2. Once that is done, add a markdown file with the name of the category you just added, for example, `benchmark.md` for a category named `benchmark`.

3. Redeployment of the website should reflect the new category.

NOTE: A category shows up as a filter option only if there is at least one resource that has that category.

# Adding a New Page

Each page is a JavaScript file in the `pages` directory. The name of the file is the URL of the page. For example, `pages/index.js` is the home page, and `pages/about.js` is the about page. The `pages/api` directory is used for API routes that are used by the application.

In order to navigate to the new page, you can use the `Link` component from `next/link`:

```jsx
import Link from 'next/link'

function Home() {
  return (
    <div>
      <Link href="/about">
        <a>About</a>
      </Link>
    </div>
  )
}
```

The links present in the top navigation bar are defined in the `components/navbar.js` file. You can add a new link by adding a `<Nav.Link>` component to the `<Nav>` component:

```jsx
<Nav.Link href="/about">About</Nav.Link>
```

While the links present in the bottom footer are defined in the `components/footer.js` file. You can add a new link by adding a `<Link>` component to the corresponding section:

```jsx
<Link href="/about">
  <a>About</a>
</Link>
```

# Configuring the Tabs

The configurations for the tabs are stored in the `tabs` object in the `gem5.config.json` file. To define the set of tabs for a particular category of resources, add the category name as a key to the `tabs` object. Each key in the `tabs` object has three types of tabs:

- `tab`: These keys are displayed as separate tabs in the main section
- `additionalInfo`: These keys are displayed under a single tab (Additional Info) in the form of a table.
- `metadata`: These keys are displayed on the right side of the main section as a part of the resource metadata.

Each field in one of these tabs is defined as an object with the following properties:

- `displayName`: The name of the field to be displayed in the UI. If not specified, the key is used as the display name.

A sample configuration for the `workload` category is shown below:

```json
"workload": {
  "tab": {
    "function": {
      "displayName": "Function"
    }
  },
  "additionalInfo": {
    "arguments": {
      "displayName": "Parameters"
    },
    "region_id": {
    }
  },
  "metadata": {
    "resource_directory": {
      "displayName": "Resource Directory"
    }
  }
}
```

In the above file, `function` would be rendered as a separate tab in the Resource page, titled `Function` since that is its `displayName`. `arguments` and `region_id` would be rendered as a table inside a `Additional Info` tab in the Resource page.  `resource_directory` would be rendered as `Resource Directory` on the right side of the page in the metadata section, under other information like the Resource Author, License, etc. Note that since a `displayName` for `region_id` is not provided, it would render as `region_id` on the website, while `arguments` would render with its `displayName`, `Parameters`.

If the configuration for a particular category is not specified, by default, the required tabs from the schema are shown as tabs while the optional tabs are shown as additional info.

# Editing Information on the Help page or About page

To edit the information shown on the Help page or the About page, navigate to `pages/`. Edit the corresponding .md file, `help.md` for the Help page and `about.md` for the About page. Redeploy the website.

# Changing CSS

To edit the CSS of a particular component, navigate to the source code of the compenent, located in the `components/` directory. Find the class name of the CSS you want to edit. You can either change the CSS in the source file itself or navigate to `styles/` and change it there, under `globals.css`.

# Adding a JSON file as a Static Page

Upload the JSON file under `public/`. It should then be viewable at `https://resources.gem5.org/[YOUR_FILE_NAME]`.

# Searching Resources

In case searching does not work on the website (i.e., putting in a query does not work but filtering works), you need to update the search index. To do this, go to the MongoDB Atlas dashboard and click on the `Search` tab. Then click on the `Create Index` button. In the `Create Index` dialog box, select `Visual Editor` first. Then, select the database and collection you wish to create a search index for, along with a name for it. Then, create the index and the website should be able to search again.

# Testing Configurations

All of the tests are run before deployment as well as before merging a pull request. The `tests.yml` file in the `.github/workflows/` directory contains the configuration for running the tests. These are the steps that are run:

1. Checkout the repository
2. Install Node.js `v18.16.0`
3. Install dependencies
4. Run the jest unit tests
5. Run the Cypress integration tests

## jest.config.js

This repository contains the configuration file `jest.config.js` for running tests with Jest. The configuration file specifies various settings and options for Jest to customize the testing environment.

### Configuration Details

- `collectCoverage`: When set to `true`, enables code coverage collection during test runs.
- `coverageProvider`: Specifies the coverage provider to use. In this case, it is set to '`v8`', which offers good speed and generates a relatively good coverage report when using Node.js 14.x.
- `collectCoverageFrom`: Defines the files or patterns to collect code coverage from during tests. It includes JavaScript and TypeScript files (`js`, `jsx`, `ts`, `tsx`), excluding declaration files (`d.ts`), files in `node_modules`, and specific directories (`out/`, `.next/`, `.github/`, etc.).
- `moduleNameMapper`: Specifies the module name mappings for Jest. It allows mapping different file types or paths to specific modules or mocks. This configuration provides mappings for CSS imports, image imports, module aliases, relative paths, and the public directory.
- `setupFilesAfterEnv`: Specifies setup files to be executed before each test is run. It includes the `jest.setup.js` file located in the root directory.
- `testPathIgnorePatterns`: Defines patterns to ignore when searching for test files. It excludes the `node_modules/` and `.next/` directories.
- `modulePaths`: Specifies additional module paths to be used by Jest. It includes the node_modules/ directory.
- `testEnvironment`: Specifies the test environment for running tests. In this case, it is set to jsdom, which simulates a browser-like environment using JSDOM.
- `transform`: Defines the file transformations to be applied to different file types before running tests. It uses `babel-jest` with the `next/babel` preset to transpile JavaScript, TypeScript, and React files.
- `transformIgnorePatterns`: Specifies patterns to ignore when transforming files. It excludes node_modules/ and files with the extension `.module.css`, `.module.sass`, or `.module.scss`.
- `fakeTimers`: Enables Jest's fake timers globally during tests.

Please note that the `jest.config.js` file should be placed in the root directory of your project for Jest to recognize and apply the configuration.

Feel free to modify these settings according to your project's requirements. For more information, refer to the [Jest documentation](https://jestjs.io/docs/configuration).

### Running Jest

To install:

```bash
npm install --save-dev jest
```

To run:

```bash
npm test
```

## cypress.config.js

### Configuration Details

This repository contains the configuration file `cypress.config.js` for Cypress, a JavaScript end-to-end testing framework. The configuration file specifies various settings and options for running Cypress tests.

The configuration file is exporting a Cypress configuration object defined using the `defineConfig` function provided by Cypress.

- `e2e`: Specifies the end-to-end testing configuration options.
    - `setupNodeEvents`: Allows implementing custom node event listeners. You can define your own event listeners in this function.
    - `baseUrl`: Sets the base URL for the application being tested. In this case, it is set to `http://localhost:3000`.
    - `experimentalRunAllSpecs`: When set to `true`, enables running all specs regardless of whether they are part of the test run or not.
- `video`: When set to `false`, disables video recording of test runs.
- `screenshot`: When set to `false`, disables taking screenshots during test runs.
- `env`: Defines environment variables to be set for the Cypress tests.
    - `BASE_PATH`: Specifies the base path for the application. It is currently set to an empty string.
    - `SCHEMA_URL`: Uses the `config.schemaUrl` value from the `gem5.config.json` file.
    - `SOURCES`: Uses the `config.resources` value from the gem5.config.json file.
    - `TABS`: Uses the `ui.tabs` value from the `gem5.config.json` file.

Please make sure to have the `gem5.config.json` file in the same directory as the `cypress.config.js` file for the config variable to be properly imported.

You can modify these settings based on your specific requirements. For more information about Cypress configuration, refer to the [Cypress documentation](https://docs.cypress.io/guides/references/configuration).

### Running Cypress

To install:

```bash
npm install cypress
```

To run:

```bash
npm run e2e:headless
```



