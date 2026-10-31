import Link from "next/link";
import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-center gap-1 border-t border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
      <h5 className="mb-1 font-semibold text-slate-700">
        <span className="font-normal ">Feito por: </span>Tatiane Weitzel
      </h5>
      <ul className="list-none mb-0  flex flex-row items-center justify-center">
        <li className="flex flex-col items-center justify-between p-1">
          <Link aria-label="GitHub" className="hover:text-yellow-700" href="https://github.com/weitzz" target="_blank" rel="noreferrer">
            <FaGithub size={22} />
          </Link>
        </li>
        <li className="flex flex-col items-center justify-between p-1">
          <Link
            aria-label="LinkedIn"
            className="hover:text-yellow-700"
            href="https://www.linkedin.com/in/tatiane-weitzel/"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedin size={22} />
          </Link>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
