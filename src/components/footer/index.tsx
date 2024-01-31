import Link from "next/link";
import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="flex gap-2 items-center justify-center flex-col p-8 border-t border-yellow-300 bg-slate-100 text-slate-500">
      <h5 className=" font-bold mb-2.5 ">
        <span className="font-normal ">Feito por: </span>Tatiane Weitzel
      </h5>
      <ul className="list-none mb-0  flex flex-row items-center justify-center">
        <li className=" flex flex-col items-center justify-between p-2.5">
          <Link href="https://github.com/weitzz" target="_blank">
            <FaGithub size={26} />
          </Link>
        </li>
        <li className=" flex flex-col items-center justify-between p-2.5">
          <Link
            href="https://www.linkedin.com/in/tatiane-weitzel/"
            target="_blank"
          >
            <FaLinkedin size={26} />
          </Link>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
