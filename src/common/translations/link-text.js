function LinkText({ href, children }) {
  return <a rel='noreferrer' href={href} target='_blank'>{children}</a>;
}

export default LinkText;