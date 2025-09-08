import ReactMarkdown from 'react-markdown';

export default function Markdown({ children }: { children: string }) {
  return <ReactMarkdown>{children}</ReactMarkdown>;
}