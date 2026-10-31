import React from "react";
interface IContainer {
  children: React.ReactNode;
}

const Container = ({ children }: IContainer) => {
  return <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6">{children}</div>;
};

export default Container;
