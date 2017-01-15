import { Container } from "inversify";
import {BookRepository} from "../../api/book/BookRepository";
import {BookCassandraRepository} from "../../api/book/BookCassandraRepository";
import {UserAccountRepository} from "../../api/user/account/UserAccountRepository";
import {UserAccountCassandraRepository} from "../../api/user/account/UserAccountCassandraRepository";
import {UserAccountService} from "../../api/user/account/UserAccountService";
import {UserAccountServiceImpl} from "../../api/user/account/UserAccountServiceImpl";
import TYPES_INV from "./aop-definition";
import {EditBookPagesCassandraRepository} from "../../api/book/edit-book-pages/EditBookPagesCassandraRepository";
import {EditBookPagesRepository} from "../../api/book/edit-book-pages/EditBookPagesRepository";

var container = new Container();
container.bind<BookRepository>(TYPES_INV.BookRepository).to(BookCassandraRepository);
container.bind<UserAccountRepository>(TYPES_INV.UserAccountRepository).to(UserAccountCassandraRepository);
container.bind<EditBookPagesRepository>(TYPES_INV.EditBookPagesRepository).to(EditBookPagesCassandraRepository);
container.bind<UserAccountService>(TYPES_INV.UserAccountService).to(UserAccountServiceImpl);

export default container;