const Footer = () => {

  return (
    <footer
      style={{
        bottom: 0,
        left: 0,
        width: "100%",
        background: "#f1f5f9",
        textAlign: "center",
        padding: "10px 0",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxShadow: "0 -2px 5px rgba(0,0,0,0.1)"
      }}
    >
      &copy; {new Date().getFullYear()} God Level Panel — Last Updated At: 10:59PM on 30-11-2025
    </footer>
  );
};

export default Footer;
