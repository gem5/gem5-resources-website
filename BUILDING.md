# Building the Website
## Running it Locally

Firstly, you need to install the dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Next, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building a Static Version

To build a static version of the website, run the following command:

```bash
npm run build
```

Once the build is complete, you can export the static version of the website using the following command:

```bash
npm run export
```

The static version of the website will be exported to the `out` directory.

To serve the static version of the website, you can use any static server. For example, you can use the `serve` package:

```bash
npm install -g serve
serve out
```

# Automatic Deployment

## Using GitHub Pages

Go to the "Pages" section of GitHub Settings. If deploying to a custom domain, add that information here.

## GitHub Action to Deploy to Github Pages

Our GitHub Actions workflow in `.github/workflows/main.yml` automatically deploys a static website to GitHub Pages when changes are pushed to the "main" branch. It utilizes the [JamesIves/github-pages-deploy-action](https://github.com/marketplace/actions/deploy-to-github-pages) action to perform the deployment

### Workflow Configuration

The workflow is triggered on the push event, specifically for the main branch, and also allows for manual triggering using the workflow_dispatch event.

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
