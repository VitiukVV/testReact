import { Component } from 'react';
import { nanoid } from 'nanoid';
import ContactForm from './form/ContactForm';
import Filter from './filter/Filter';
import { ContactList } from './contact-list/ContactList';
import { Container } from './app.style';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
    console.log(parsedContacts);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevState);
    console.log(this.state);
    if (this.state.contacts !== prevState) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  formSubmitHandler = data => {
    const newContact = { id: nanoid(), ...data };
    this.checkContact(newContact)
      ? alert(newContact.name + ' is already in contacts!')
      : this.setState(prevValue => ({
          contacts: [...prevValue.contacts, newContact],
        }));
  };

  checkContact = newContact => {
    const normalizeContact = newContact.name.toLowerCase();
    return this.state.contacts.some(
      contact => contact.name.toLowerCase() === normalizeContact
    );
  };

  changeFilter = evt => {
    this.setState({ filter: evt.target.value });
  };

  deleteContacts = id => {
    this.setState(prevValue => ({
      contacts: prevValue.contacts.filter(contact => contact.id !== id),
    }));
  };

  render() {
    const { contacts, filter } = this.state;
    const normalizeFilter = filter.toLowerCase();
    const filtredContacts = contacts.filter(({ name }) =>
      name.toLowerCase().includes(normalizeFilter)
    );
    return (
      <Container>
        <h1>Phonebook</h1>
        <ContactForm onSubmitForm={this.formSubmitHandler}></ContactForm>
        <h2>Contacts</h2>
        <Filter value={filter} onChange={this.changeFilter}></Filter>
        <ContactList
          contacts={filtredContacts}
          onDeleteContacts={this.deleteContacts}
        ></ContactList>
      </Container>
    );
  }
}
