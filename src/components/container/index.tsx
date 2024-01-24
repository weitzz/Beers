import React from "react";
interface IContainer {
  children: React.ReactNode;
}

const Container = ({ children }: IContainer) => {
  return <main className="max-w-screen-xl mx-auto px-3">{children}</main>;
};

export default Container;
