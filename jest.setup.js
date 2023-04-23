import '@testing-library/jest-dom/extend-expect'

import '@testing-library/jest-dom'

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock("react-markdown", () => (props, ...rest) => {
    return <>{props.children}</>
})

jest.mock("remark-gfm", () => () => {
})

jest.mock("remark-toc", () => () => {
})

jest.mock("rehype-highlight", () => () => {
})

jest.mock("rehype-slug", () => () => {
})

jest.mock("rehype-raw", () => () => {
})

jest.mock("remark-frontmatter", () => () => {
})

jest.mock("rehype", () => () => {
})