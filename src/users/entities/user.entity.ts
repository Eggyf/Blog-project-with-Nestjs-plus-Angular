import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column({ unique: true })
    username: string;
    @Column({ unique: true })
    password: string;
    @Column()
    email: string;
    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
}
