import markdownit from 'markdown-it'
import hljs from 'highlight.js'

const md: any = markdownit({
	highlight: function (str: string, lang: string) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return hljs.highlight(str, { language: lang }).value;
			} catch (__) {}
		}

		return ''; // use external default escaping
	}
});

export const render = (src: string) =>  md.render(src);