-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NULL,
    `fatherName` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `gender` ENUM('male', 'female', 'other') NOT NULL,
    `address` VARCHAR(191) NULL,
    `pin` VARCHAR(191) NULL,
    `aadhaar` VARCHAR(191) NULL,
    `pan` VARCHAR(191) NULL,
    `dob` DATETIME(3) NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `userType` ENUM('admin', 'normal') NOT NULL DEFAULT 'normal',

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Otp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `otp` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BusinessProfile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `businessName` VARCHAR(191) NOT NULL,
    `pan` VARCHAR(191) NULL,
    `tan` VARCHAR(191) NULL,
    `gstin` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `bankName` VARCHAR(191) NULL,
    `bankAccountNo` VARCHAR(191) NULL,
    `bankIfsc` VARCHAR(191) NULL,
    `bankBranch` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isAddressVerified` BOOLEAN NULL,
    `isBusinessNameVerified` BOOLEAN NULL,
    `isGstinVerified` BOOLEAN NULL,
    `isPanVerified` BOOLEAN NULL,
    `isStateVerified` BOOLEAN NULL,

    UNIQUE INDEX `BusinessProfile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ledger` (
    `id` VARCHAR(191) NOT NULL,
    `ledgerName` VARCHAR(191) NOT NULL,
    `openingBalance` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    `balance` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    `userId` INTEGER NOT NULL,
    `partyId` VARCHAR(191) NULL,
    `year` INTEGER NOT NULL DEFAULT 2023,
    `month` INTEGER NOT NULL DEFAULT 0,
    `ledgerType` ENUM('bank', 'cash', 'purchase', 'sales', 'directExpense', 'indirectExpense', 'directIncome', 'indirectIncome', 'fixedAssets', 'currentAssets', 'loansAndLiabilities', 'accountsReceivable', 'accountsPayable') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JournalEntry` (
    `id` VARCHAR(191) NOT NULL,
    `entryDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `description` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` VARCHAR(191) NOT NULL,
    `ledgerId` VARCHAR(191) NOT NULL,
    `journalEntryId` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `transactionType` ENUM('credit', 'debit') NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Party` (
    `id` VARCHAR(191) NOT NULL,
    `partyName` VARCHAR(191) NOT NULL,
    `type` ENUM('customer', 'supplier') NOT NULL,
    `gstin` VARCHAR(191) NULL,
    `pan` VARCHAR(191) NULL,
    `tan` VARCHAR(191) NULL,
    `upi` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `bankName` VARCHAR(191) NULL,
    `bankAccountNumber` VARCHAR(191) NULL,
    `bankIfsc` VARCHAR(191) NULL,
    `bankBranch` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    FULLTEXT INDEX `Party_partyName_idx`(`partyName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `categoryName` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `id` VARCHAR(191) NOT NULL,
    `itemName` VARCHAR(191) NOT NULL,
    `unit` ENUM('pieces', 'grams', 'kilograms', 'liters', 'milliliters', 'meters', 'centimeters', 'inches', 'feet', 'squareMeters', 'squareFeet', 'cubicMeters', 'cubicFeet', 'dozen', 'pack', 'carton', 'box', 'roll', 'bundle', 'pair', 'set') NOT NULL DEFAULT 'pieces',
    `price` DECIMAL(65, 30) NOT NULL,
    `openingStock` DECIMAL(65, 30) NULL,
    `closingStock` DECIMAL(65, 30) NULL,
    `purchasePrice` DECIMAL(65, 30) NULL,
    `gst` DECIMAL(65, 30) NULL,
    `taxExempted` BOOLEAN NOT NULL DEFAULT false,
    `description` VARCHAR(191) NULL,
    `hsnCode` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NULL,
    `supplierId` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    FULLTEXT INDEX `Item_itemName_idx`(`itemName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceNumber` VARCHAR(191) NULL,
    `type` ENUM('sales', 'purchase', 'sales_return', 'purchase_return') NOT NULL,
    `totalAmount` DOUBLE NOT NULL,
    `totalGst` DOUBLE NULL,
    `stateOfSupply` VARCHAR(191) NOT NULL,
    `cgst` DOUBLE NULL,
    `sgst` DOUBLE NULL,
    `igst` DOUBLE NULL,
    `utgst` DOUBLE NULL,
    `details` VARCHAR(191) NULL,
    `extraDetails` VARCHAR(191) NULL,
    `modeOfPayment` ENUM('cash', 'bank', 'upi', 'credit') NOT NULL,
    `credit` BOOLEAN NOT NULL,
    `userId` INTEGER NOT NULL,
    `partyId` VARCHAR(191) NOT NULL,
    `gstNumber` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('unpaid', 'paid', 'overdue') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceItem` (
    `id` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `discount` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    `invoiceId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` VARCHAR(191) NOT NULL,
    `serviceName` VARCHAR(191) NOT NULL,
    `serviceType` VARCHAR(191) NULL,
    `imgUrl` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `gst` DECIMAL(65, 30) NOT NULL,
    `documents` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `services` JSON NOT NULL,
    `status` ENUM('initiated', 'pending', 'success', 'failure', 'usercancelled', 'dropped', 'bounced') NOT NULL DEFAULT 'pending',
    `price` DECIMAL(65, 30) NOT NULL,
    `gst` DECIMAL(65, 30) NOT NULL,
    `orderTotal` DECIMAL(65, 30) NOT NULL,
    `stateOfSupply` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `razorpay_order_id` VARCHAR(191) NOT NULL,
    `razorpay_payment_id` VARCHAR(191) NOT NULL,
    `status` ENUM('created', 'success', 'failed') NOT NULL DEFAULT 'created',
    `userId` INTEGER NOT NULL,
    `orderId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Library` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pan` VARCHAR(191) NOT NULL,
    `section` VARCHAR(191) NOT NULL,
    `sub_section` VARCHAR(191) NULL,
    `subject` VARCHAR(191) NOT NULL,
    `ao_order` VARCHAR(191) NOT NULL,
    `itat_no` VARCHAR(191) NOT NULL,
    `rsa_no` VARCHAR(191) NULL,
    `bench` VARCHAR(191) NOT NULL,
    `appeal_no` VARCHAR(191) NULL,
    `appellant` VARCHAR(191) NULL,
    `respondent` VARCHAR(191) NOT NULL,
    `appeal_type` VARCHAR(191) NOT NULL,
    `appeal_filed_by` VARCHAR(191) NOT NULL,
    `order_result` VARCHAR(191) NOT NULL,
    `tribunal_order_date` VARCHAR(191) NOT NULL,
    `assessment_year` VARCHAR(191) NOT NULL,
    `judgment` LONGTEXT NOT NULL,
    `conclusion` LONGTEXT NOT NULL,
    `download` VARCHAR(191) NOT NULL,
    `upload` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `accountName` VARCHAR(191) NOT NULL,
    `totalDebit` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    `totalCredit` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    `debitBalance` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    `creditBalance` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Career` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `pin` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `skills` VARCHAR(191) NOT NULL,
    `gender` ENUM('male', 'female', 'other') NOT NULL,
    `cv` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Billrecieve` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `billNumber` VARCHAR(191) NOT NULL,
    `amount` VARCHAR(191) NOT NULL,
    `tax` VARCHAR(191) NOT NULL,
    `customerName` VARCHAR(191) NOT NULL,
    `customerAddress` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `itemQuantity` VARCHAR(191) NOT NULL,
    `itemPrice` VARCHAR(191) NOT NULL,
    `itemDescription` VARCHAR(191) NOT NULL,
    `paymentStatus` ENUM('paid', 'unpaid', 'overdue') NOT NULL DEFAULT 'unpaid',
    `paymentMethod` ENUM('cash', 'creditcard', 'upi', 'netbanking', 'cheque') NOT NULL DEFAULT 'cash',
    `dueDate` VARCHAR(191) NOT NULL,
    `comment` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Billpayable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `supplierName` VARCHAR(191) NOT NULL,
    `supplierAddress` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `billDate` VARCHAR(191) NOT NULL,
    `dueDate` VARCHAR(191) NOT NULL,
    `billAmount` VARCHAR(191) NOT NULL,
    `billNumber` VARCHAR(191) NOT NULL,
    `billDiscription` VARCHAR(191) NOT NULL,
    `paymentMethod` ENUM('cash', 'creditcard', 'upi', 'netbanking', 'cheque') NOT NULL DEFAULT 'cash',
    `transactionId` VARCHAR(191) NULL,
    `paymentDate` VARCHAR(191) NOT NULL,
    `paymentAmount` VARCHAR(191) NOT NULL,
    `tax` VARCHAR(191) NOT NULL,
    `comment` VARCHAR(191) NULL,
    `invoiceNumber` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UploadedDocument` (
    `id` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `applicationId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoanDocument` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `shortName` VARCHAR(191) NOT NULL,
    `mandatory` BOOLEAN NOT NULL DEFAULT false,
    `type` ENUM('pdf', 'image', 'other') NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Loan` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('personal', 'education', 'home', 'business', 'car', 'property') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `shortName` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `maxAmount` DECIMAL(65, 30) NULL,
    `minAmount` DECIMAL(65, 30) NULL,
    `interest` DECIMAL(65, 30) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoanApplication` (
    `id` VARCHAR(191) NOT NULL,
    `loanId` VARCHAR(191) NOT NULL,
    `loanAmount` DECIMAL(65, 30) NOT NULL,
    `loanStatus` ENUM('pending', 'processing', 'review', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    `applicantName` VARCHAR(191) NOT NULL,
    `applicantAge` INTEGER NOT NULL,
    `loanType` ENUM('personal', 'education', 'home', 'business', 'car', 'property') NOT NULL,
    `applicantGender` ENUM('male', 'female', 'other') NOT NULL,
    `nationality` ENUM('resident', 'nri', 'foreign') NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `salaried` BOOLEAN NOT NULL,
    `bankAccountId` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `permanentAddress` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `agentId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BankDetails` (
    `id` VARCHAR(191) NOT NULL,
    `accountHolderName` VARCHAR(191) NOT NULL,
    `bankName` VARCHAR(191) NOT NULL,
    `bankAccountNo` VARCHAR(191) NOT NULL,
    `bankIfsc` VARCHAR(191) NOT NULL,
    `bankBranch` VARCHAR(191) NOT NULL,
    `bankAccountType` ENUM('savings', 'current', 'nri', 'fcnr', 'rd', 'fd', 'salary') NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Insurance` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `dob` DATETIME(3) NOT NULL,
    `maritalStatus` VARCHAR(191) NOT NULL,
    `gender` ENUM('male', 'female', 'other') NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `agentId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agent` (
    `id` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Agent_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Visitor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `count` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RegisterStartup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `categories` ENUM('registration', 'companyRegistration', 'returns', 'audits') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactUs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `About` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AccountToInvoice` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AccountToInvoice_AB_unique`(`A`, `B`),
    INDEX `_AccountToInvoice_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_LoanDocumentToUploadedDocument` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_LoanDocumentToUploadedDocument_AB_unique`(`A`, `B`),
    INDEX `_LoanDocumentToUploadedDocument_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_LoanToLoanDocument` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_LoanToLoanDocument_AB_unique`(`A`, `B`),
    INDEX `_LoanToLoanDocument_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Otp` ADD CONSTRAINT `Otp_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BusinessProfile` ADD CONSTRAINT `BusinessProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ledger` ADD CONSTRAINT `Ledger_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ledger` ADD CONSTRAINT `Ledger_partyId_fkey` FOREIGN KEY (`partyId`) REFERENCES `Party`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JournalEntry` ADD CONSTRAINT `JournalEntry_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_ledgerId_fkey` FOREIGN KEY (`ledgerId`) REFERENCES `Ledger`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_journalEntryId_fkey` FOREIGN KEY (`journalEntryId`) REFERENCES `JournalEntry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Party` ADD CONSTRAINT `Party_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Party`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_partyId_fkey` FOREIGN KEY (`partyId`) REFERENCES `Party`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UploadedDocument` ADD CONSTRAINT `UploadedDocument_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UploadedDocument` ADD CONSTRAINT `UploadedDocument_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `LoanApplication`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanApplication` ADD CONSTRAINT `LoanApplication_loanId_fkey` FOREIGN KEY (`loanId`) REFERENCES `Loan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanApplication` ADD CONSTRAINT `LoanApplication_bankAccountId_fkey` FOREIGN KEY (`bankAccountId`) REFERENCES `BankDetails`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanApplication` ADD CONSTRAINT `LoanApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanApplication` ADD CONSTRAINT `LoanApplication_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `Agent`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BankDetails` ADD CONSTRAINT `BankDetails_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Insurance` ADD CONSTRAINT `Insurance_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `Agent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agent` ADD CONSTRAINT `Agent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegisterStartup` ADD CONSTRAINT `RegisterStartup_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContactUs` ADD CONSTRAINT `ContactUs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AccountToInvoice` ADD CONSTRAINT `_AccountToInvoice_A_fkey` FOREIGN KEY (`A`) REFERENCES `Account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AccountToInvoice` ADD CONSTRAINT `_AccountToInvoice_B_fkey` FOREIGN KEY (`B`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LoanDocumentToUploadedDocument` ADD CONSTRAINT `_LoanDocumentToUploadedDocument_A_fkey` FOREIGN KEY (`A`) REFERENCES `LoanDocument`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LoanDocumentToUploadedDocument` ADD CONSTRAINT `_LoanDocumentToUploadedDocument_B_fkey` FOREIGN KEY (`B`) REFERENCES `UploadedDocument`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LoanToLoanDocument` ADD CONSTRAINT `_LoanToLoanDocument_A_fkey` FOREIGN KEY (`A`) REFERENCES `Loan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LoanToLoanDocument` ADD CONSTRAINT `_LoanToLoanDocument_B_fkey` FOREIGN KEY (`B`) REFERENCES `LoanDocument`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
