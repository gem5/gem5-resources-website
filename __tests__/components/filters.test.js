import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Filters from "@/components/filters";

describe("Filters component", () => {
    const filters = {
      filter1: {
        value1: true,
        value2: false,
      },
      "gem5_versions": {
        value3: true,
        value4: true,
        value5: false,
      },
      "database": {
        value6: false,
      }
    };
    const callback = jest.fn();

    it("renders without crashing", () => {
        render(<Filters filters={filters} callback={callback} />);
    });

    it("renders filters correctly", () => {
        const result = render(<Filters filters={filters} callback={callback} />);
        expect(result.container.querySelector("#value1")).toBeInTheDocument();
        expect(result.container.querySelector("#value2")).toBeInTheDocument();
        expect(result.container.querySelector("#value3")).toBeInTheDocument();
        expect(result.container.querySelector("#value4")).toBeInTheDocument();
        expect(result.container.querySelector("#value5")).toBeInTheDocument();
        expect(result.container.querySelector("#value6")).not.toBeInTheDocument();
    });

    it("calls callback function on filter change", () => {
        const result = render(<Filters filters={filters} callback={callback} />);
        fireEvent.click(result.container.querySelector("#value1"));
        expect(callback).toHaveBeenCalled();
    });

});
  