# Building and Deploying gem5 Vision

## Using GitHub Pages

Go to the "Pages" section of GitHub Settings. If deploying to a custom domain, add that information here.

## GitHub Action to Deploy to Github Pages

Our GitHub Actions workflow in `.github/workflows/main.yml` automatically deploys a static website to GitHub Pages when changes are pushed to the "static-website" branch. It utilizes the ["JamesIves/github-pages-deploy-action"](https://github.com/marketplace/actions/deploy-to-github-pages) action to perform the deployment

### Workflow Configuration

The workflow is triggered on the push event, specifically for the static-website branch, and also allows for manual triggering using the workflow_dispatch event.

### Job: deployment

The `deployment` job runs on the `ubuntu-latest` operating system.

**Steps**:

1. `Checkout`: This step uses the `actions/checkout` action to checkout the code from the repository.
2. `Setup Node`: This step uses the `actions/setup-node` action to set up Node.js with the specified LTS (Long-Term Support) version and npm cache.
3. `Install Node Modules`: This step installs the node modules used in this codebase through `npm ci`.
4. `Jest`: This step uses Jest.js to run unit test suites on the codebase.
5. `Cypress run`: This step runs the End-to-End test suite on Cypress.
6. `Build`: This step performs the following actions:

    - Runs the build script using `npm run build`.
    - Exports the build using `npm run export`.

7. `Deploy`: This step uses the `JamesIves/github-pages-deploy-action` action to deploy the built website to GitHub Pages. It specifies the `./out` directory as the publish directory, which is the directory where the built website is exported. The website is exported to the `gh-pages` branch.

## Database Configuration

The following extra environment variables are used in the main configuration file (`next.config.js`) and are added through `gem5.config.json`:

### `schemaUrl`

Description: The Raw GitHub URL of where the gem5 Resources Schema lies.

### `resources`

This is an object containing multiple key-value pairs representing different configurations for private resources used in the application.

In case of a **MongoDB** database, every object must contain the following properties:

- `dataSource`: The data source name.
- `database`: The database name.
- `collection`: The collection name.
- `url`: The URL of the MongoDB API endpoint.
- `name`: The name of the data source.
- `apiKey`: The API key for accessing the MongoDB data (read-only).
- `isMongo`: A boolean value indicating whether the data source is MongoDB or not, set to true.

In case of a **JSON** database, every object must contain the following properties:

- `url`: The Raw GitHub URL of the JSON data, or the local path, with root directory being the `public` directory of this codebase.
- `isMongo`: A boolean value indicating whether the data source is MongoDB or not, set to false.
