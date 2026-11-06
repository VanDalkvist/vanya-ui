import "@testing-library/jest-dom";

// jsdom does not implement the browser top-layer dialog API.
HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
