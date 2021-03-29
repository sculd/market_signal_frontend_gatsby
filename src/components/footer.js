import React from 'react';
import { Container, Nav, NavItem } from 'react-bootstrap';

function Footer(/*props*/) {
    return (
      <footer>
        <Container>
          <div className="text-center small copyright">
            © RLM 2016
          </div>
        </Container>
      </footer>
    );
  }
  
  export default Footer;