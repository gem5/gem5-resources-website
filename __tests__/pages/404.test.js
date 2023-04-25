import { render, screen } from "@testing-library/react";
import Custom404 from "@/pages/404";
import { useRouter } from "next/router";


jest.mock("next/router", () => ({
    useRouter: jest.fn(),
  }));


describe("Custom404", () => {
    it("renders error message", () => {
        useRouter.mockReturnValue({
            isReady: true,
            asPath: "/",
            push: jest.fn(),
            });
        render(<Custom404 />);
        expect(screen.getByText(/The page you are looking for does not seem to exist./i)).toBeInTheDocument();
    });

    it("renders error message with wrong url", () => {
        useRouter.mockReturnValue({
            isReady: true,
            asPath: "/harshil/patel",
            push: jest.fn(),
            });
        render(<Custom404 />);
        expect(screen.getByText(/The page you are looking for does not seem to exist./i)).toBeInTheDocument();
    });

    it("renders loading message", () => {
        useRouter.mockReturnValue({
            isReady: false,
            asPath: "/",
            push: jest.fn(),
            });
        render(<Custom404 />);
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });
});