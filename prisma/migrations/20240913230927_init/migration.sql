-- CreateTable
CREATE TABLE "Appointment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "owner" TEXT NOT NULL,
    "vehicle" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "time" TEXT NOT NULL
);
