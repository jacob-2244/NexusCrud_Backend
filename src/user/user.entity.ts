import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  GUEST = 'guest'
}

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ unique: true })
    email: string

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.MANAGER
    })



    role: UserRole
}