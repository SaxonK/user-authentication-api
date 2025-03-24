import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from "typeorm"

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: false, select: false })
    hash!: string;

    @Column({ nullable: false })
    firstName!: string;

    @Column({ nullable: false })
    lastName!: string;

    @Column({ nullable: false, unique: true })
    email!: string;

    @Column({ nullable: true, unique: false })
    company!: string;

    @Column({ nullable: true, unique: false })
    country!: string;

    @Column({ nullable: true, unique: false })
    phoneNumber!: string;

    @Column({ nullable: true, unique: false })
    profilePicture!: string;

    @Column({ nullable: true, unique: false })
    lastLogoutDateTime!: Date;

    @Column({ nullable: false, default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdDate!: Date;

    @UpdateDateColumn()
    lastUpdatedDate!: Date;

    @BeforeInsert()
    @BeforeUpdate()
    trimStrings() {
        this.email = this.email.trim();
    }
};