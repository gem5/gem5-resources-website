# Building the Website

This document describes how to build and deploy the gem5 Resources website. It is built using [Next.js](https://nextjs.org/), a React framework for building static and server-side rendered websites.
# Table of Contents
- [Building the Website](#building-the-website)
- [Table of Contents](#table-of-contents)
- [Running it Locally](#running-it-locally)
- [Building a Static Version](#building-a-static-version)
- [Automatic Deployment](#automatic-deployment)
  - [Using GitHub Pages](#using-github-pages)
  - [GitHub Action to Deploy to Github Pages](#github-action-to-deploy-to-github-pages)
    - [Workflow Triggers](#workflow-triggers)
    - [Permissions](#permissions)
    - [Jobs](#jobs)
      - [Build Job](#build-job)
      - [Steps](#steps)
      - [Deployment Job](#deployment-job)
      - [Steps](#steps-1)
      - [Note](#note)

# Running it Locally

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

# Building a Static Version

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

In order to host the website on a different domain, firstly you need to add a CNAME file to the `public` directory with the domain name as the content of the file. For example, if you want to host the website on `https://resources.gem5.org`, you need to add a file named `CNAME` to the `public` directory with the content `resources.gem5.org`.
Next, in order to load the static assets correctly, you need to change the `assetPrefix` and `basePath` properties in the `next.config.js` file. For example, if you want to host the website on `https://resources.gem5.org`, you need to change the `assetPrefix` and `basePath` properties to `undefined` and `/` respectively. If you want to host the website on `https://resources.gem5.org/gem5-resources`, you need to change the `assetPrefix` and `basePath` properties to `/gem5-resources/` and `/gem5-resources` respectively.

## GitHub Action to Deploy to Github Pages

Our GitHub Actions workflow in `.github/workflows/main.yml` automatically deploys a static website to GitHub Pages when changes are pushed to the "main" branch. It includes a build job to build the Next.js project and run tests, and a deployment job to deploy the built project to GitHub Pages.

### Workflow Triggers

The workflow is triggered in the following cases:

- **Push**: The workflow will be triggered when a push occurs on the `main` branch.
- **Manual Dispatch**: The workflow can also be manually triggered using the workflow dispatch event.

### Permissions

The workflow requires the following permissions:

- **Contents**: Read access to repository contents.
- **Pages**: Write access to GitHub Pages.
- **ID Token**: Write access to GitHub ID token.

### Jobs

#### Build Job

The build job is responsible for building the Next.js project, running tests, and generating static HTML files for export.

#### Steps

1. **Checkout**: Checks out the repository code using the `actions/checkout@v3` action.
2. **Setup Node**: Sets up the Node.js environment using the `actions/setup-node@v3` action. It specifies the Node.js version (`18.16.0`) and caches the `npm` directory.
3. **Restore Cache**: Restores the cache to speed up subsequent builds. It caches the `.next/cache` directory and generates a new cache whenever packages or source files change.
4. **Install Dependencies**: Installs the project dependencies using `npm ci`.
5. **Run Jest Unittests**: Executes the unit tests using `npm run test:ci`.
6. **Run Cypress e2e Tests**: Runs the end-to-end tests using `npm run e2e:headless`.
7. **Build with Next.js**: Builds the Next.js project using `npm run build`.
8. **Static HTML Export with Next.js**: Generates static HTML files for export using `npm run export`.
9. **Upload Artifact**: Uploads the built project to be used in the deployment job. It uses the `actions/upload-pages-artifact@v1` action to upload the `./out` directory.

#### Deployment Job

The deployment job is responsible for deploying the built Next.js project to GitHub Pages.

#### Steps

1. **Deploy to GitHub Pages**: Deploys the project to GitHub Pages using the `actions/deploy-pages@v2` action. It deploys to the `github-pages` environment and sets the deployment URL based on the output of the previous build job.

#### Note

Make sure to configure your repository's settings to enable GitHub Pages and choose the branch and folder to serve as the source for the deployed site.
