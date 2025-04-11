import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("payment")
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "order_code", type: 'int'})
    orderCode: number; 

    @Column({ type: 'decimal', precision: 20, scale: 2 })
    amount: number; 

    @Column('text')
    description: string; 

    @Column({ type: 'varchar', length: 50, name: "account_number" })
    accountNumber: string; 

    @Column({ type: 'varchar', length: 100 })
    reference: string

    @Column({ type: 'timestamp', name: "transaction_date_time" })
    transactionDateTime: Date;

    @Column({ type: 'varchar', length: 10 })
    currency: string;  

    @Column({ type: 'varchar', length: 100, name: "payment_link_id" })
    paymentLinkId: string;

    @Column({ type: 'varchar', length: 20 })
    code: string;

    @Column({name: "error_description"})
    errorDescription: string; 

    @Column({ type: 'varchar', length: 50, nullable: true, name: "counter_account_bank_id" })
    counterAccountBankId: string | null;  // ID ngân hàng đối ứng

    @Column({ type: 'varchar', length: 100, nullable: true, name: "counter_account_bank_name" })
    counterAccountBankName: string | null;  // Tên ngân hàng đối ứng

    @Column({ type: 'varchar', length: 100, nullable: true, name: "counter_account_name" })
    counterAccountName: string | null;  // Tên chủ tài khoản đối ứng

    @Column({ type: 'varchar', length: 50, nullable: true, name: "counter_account_number" })
    counterAccountNumber: string | null;  // Số tài khoản đối ứng

    @Column({ type: 'varchar', length: 100, nullable: true, name: "virtual_account_name" })
    virtualAccountName: string | null;  // Tên chủ tài khoản ảo

    @Column({ type: 'varchar', length: 50, nullable: true, name: "virtual_account_number" })
    virtualAccountNumber: string | null;  // Số tài khoản ảo

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: "created_at" })
    createdAt: Date; 

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: "updated_at" })
    updatedAt: Date; 
}
