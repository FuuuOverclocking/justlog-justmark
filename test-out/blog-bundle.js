"use strict";
/// <reference path="../lib/article.d.ts" />
const React = order('#react');
function blog() {
    return {
        ...{
            copyright: 'CC BY-ND 4.0',
            topics: ['rust', 'net'],
            lang: '简体中文',
            bgImage: '',
            title: '博客标题',
        },
        content: (React.createElement("div", null,
            React.createElement("h1", null, "\u535A\u5BA2\u6807\u9898"),
            React.createElement("p", null, "\u535A\u5BA2\u5185\u5BB9"),
            React.createElement("p", null,
                React.createElement("em", null, "\u659C\u4F53"),
                " ",
                React.createElement("strong", null, "\u7C97\u4F53"),
                ' ',
                React.createElement("em", null,
                    React.createElement("strong", null, "\u659C\u7C97\u4F53")),
                ' ',
                React.createElement("sub", null, "\u5220\u9664\u7EBF"),
                " ",
                React.createElement("mark", null, "\u5F3A\u8C03"),
                ' ',
                React.createElement("span", { className: "katex" },
                    React.createElement("span", { className: "katex-mathml" },
                        React.createElement("math", { xmlns: "http://www.w3.org/1998/Math/MathML" },
                            React.createElement("semantics", null,
                                React.createElement("mrow", null,
                                    React.createElement("mi", null, "S"),
                                    React.createElement("mo", null, "="),
                                    React.createElement("mi", null, "\u03C0"),
                                    React.createElement("msup", null,
                                        React.createElement("mi", null, "r"),
                                        React.createElement("mn", null, "2"))),
                                React.createElement("annotation", { encoding: "application/x-tex" }, "S=\\pi r^2")))),
                    React.createElement("span", { className: "katex-html", "aria-hidden": "true" },
                        React.createElement("span", { className: "base" },
                            React.createElement("span", { className: "strut", style: { height: '0.68333em', verticalAlign: '0em' } }),
                            React.createElement("span", { className: "mord mathnormal", style: { marginRight: '0.05764em' } }, "S"),
                            React.createElement("span", { className: "mspace", style: { marginRight: '0.2777777777777778em' } }),
                            React.createElement("span", { className: "mrel" }, "="),
                            React.createElement("span", { className: "mspace", style: { marginRight: '0.2777777777777778em' } })),
                        React.createElement("span", { className: "base" },
                            React.createElement("span", { className: "strut", style: {
                                    height: '0.8141079999999999em',
                                    verticalAlign: '0em',
                                } }),
                            React.createElement("span", { className: "mord mathnormal", style: { marginRight: '0.03588em' } }, "\u03C0"),
                            React.createElement("span", { className: "mord" },
                                React.createElement("span", { className: "mord mathnormal", style: { marginRight: '0.02778em' } }, "r"),
                                React.createElement("span", { className: "msupsub" },
                                    React.createElement("span", { className: "vlist-t" },
                                        React.createElement("span", { className: "vlist-r" },
                                            React.createElement("span", { className: "vlist", style: {
                                                    height: '0.8141079999999999em',
                                                } },
                                                React.createElement("span", { style: {
                                                        top: '-3.063em',
                                                        marginRight: '0.05em',
                                                    } },
                                                    React.createElement("span", { className: "pstrut", style: { height: '2.7em' } }),
                                                    React.createElement("span", { className: "sizing reset-size6 size3 mtight" },
                                                        React.createElement("span", { className: "mord mtight" }, "2")))))))))))),
            React.createElement("p", { className: "katex-block" },
                React.createElement("span", { className: "katex-display" },
                    React.createElement("span", { className: "katex" },
                        React.createElement("span", { className: "katex-mathml" },
                            React.createElement("math", { xmlns: "http://www.w3.org/1998/Math/MathML", display: "block" },
                                React.createElement("semantics", null,
                                    React.createElement("mrow", null,
                                        React.createElement("mi", null, "E"),
                                        React.createElement("mo", null, "="),
                                        React.createElement("mi", null, "m"),
                                        React.createElement("msup", null,
                                            React.createElement("mi", null, "c"),
                                            React.createElement("mn", null, "2"))),
                                    React.createElement("annotation", { encoding: "application/x-tex" }, "E=mc^2")))),
                        React.createElement("span", { className: "katex-html", "aria-hidden": "true" },
                            React.createElement("span", { className: "base" },
                                React.createElement("span", { className: "strut", style: {
                                        height: '0.68333em',
                                        verticalAlign: '0em',
                                    } }),
                                React.createElement("span", { className: "mord mathnormal", style: { marginRight: '0.05764em' } }, "E"),
                                React.createElement("span", { className: "mspace", style: { marginRight: '0.2777777777777778em' } }),
                                React.createElement("span", { className: "mrel" }, "="),
                                React.createElement("span", { className: "mspace", style: { marginRight: '0.2777777777777778em' } })),
                            React.createElement("span", { className: "base" },
                                React.createElement("span", { className: "strut", style: {
                                        height: '0.8641079999999999em',
                                        verticalAlign: '0em',
                                    } }),
                                React.createElement("span", { className: "mord mathnormal" }, "m"),
                                React.createElement("span", { className: "mord" },
                                    React.createElement("span", { className: "mord mathnormal" }, "c"),
                                    React.createElement("span", { className: "msupsub" },
                                        React.createElement("span", { className: "vlist-t" },
                                            React.createElement("span", { className: "vlist-r" },
                                                React.createElement("span", { className: "vlist", style: {
                                                        height: '0.8641079999999999em',
                                                    } },
                                                    React.createElement("span", { style: {
                                                            top: '-3.113em',
                                                            marginRight: '0.05em',
                                                        } },
                                                        React.createElement("span", { className: "pstrut", style: {
                                                                height: '2.7em',
                                                            } }),
                                                        React.createElement("span", { className: "sizing reset-size6 size3 mtight" },
                                                            React.createElement("span", { className: "mord mtight" }, "2"))))))))))))),
            React.createElement("table", null,
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Column A"),
                        React.createElement("th", { style: { textAlign: 'right' } }, "Column B"),
                        React.createElement("th", null, "Column C"))),
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", { rowSpan: 2 }, "A1"),
                        React.createElement("td", { style: { textAlign: 'right' } }, "B1"),
                        React.createElement("td", null, "C1")),
                    React.createElement("tr", null,
                        React.createElement("td", { style: { textAlign: 'right' }, colSpan: 2 }, "B2")),
                    React.createElement("tr", null,
                        React.createElement("td", null, "A3"),
                        React.createElement("td", { style: { textAlign: 'right' } }, "B3"),
                        React.createElement("td", null, "C3")))),
            React.createElement("pre", null,
                React.createElement("code", { className: "py" },
                    "def foo(i: int):",
                    '\n',
                    '    ',
                    "return i + 1",
                    '\n')),
            React.createElement(Button, null, "\u6309\u94AE"))),
    };
}
function extendBlog() {
    return {};
}
const Button = (props) => {
    return React.createElement("button", null, props.children);
};
