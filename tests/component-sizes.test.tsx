import React from "react";
import { afterEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Badge, SegmentedControl } from "../src";

afterEach(cleanup);

it("accepts both canonical Badge sizes without losing identity", () => {
  render(<><Badge label="Life" size="sm" /><Badge label="Life" size="md" /></>);
  const labels = screen.getAllByText("Life");
  expect(labels[0].parentElement).toHaveAttribute("data-size", "sm");
  expect(labels[1].parentElement).toHaveAttribute("data-size", "md");
});

for(const size of ["sm","md"] as const){
  it("selects a segment at canonical size "+size,()=>{
    function Example(){
      const [value,setValue]=React.useState("one");
      return <><SegmentedControl items={[{id:"one",label:"Первый"},{id:"two",label:"Второй"}]} value={value} onChange={setValue} size={size}/><output>{value}</output></>;
    }
    render(<Example/>);
    expect(screen.getByRole("group")).toHaveAttribute("data-size",size);
    fireEvent.click(screen.getByRole("button",{name:"Второй"}));
    expect(screen.getByRole("button",{name:"Второй"})).toHaveAttribute("aria-pressed","true");
    expect(screen.getByText("two",{exact:true})).toBeVisible();
  });
}
