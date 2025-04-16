import $ from "jquery";

declare global {
  interface JQuery<TElement = HTMLElement> {
    internalComponentAttr(value: string | null): JQuery<TElement>;
    internalComponentAttr(): string | undefined;
  }
}

function internalComponentAttr(this: JQuery): string | undefined;
function internalComponentAttr(this: JQuery, value: string | null): JQuery;
function internalComponentAttr(
  this: JQuery,
  value?: string | null,
): JQuery | string | undefined {
  if (this.length > 1) {
    return this.each(function () {
      $(this).internalComponentAttr(value!);
    });
  }

  if (value === undefined) {
    return this.attr("data-cplx-component");
  }

  if (value === null) {
    return this.removeAttr("data-cplx-component");
  }

  return this.attr("data-cplx-component", value);
}

$.fn.internalComponentAttr = internalComponentAttr;
