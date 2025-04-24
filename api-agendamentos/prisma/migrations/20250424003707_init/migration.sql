-- CreateTable
CREATE TABLE "Agendamento" (
    "id" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "idMedico" INTEGER NOT NULL,
    "local" TEXT NOT NULL,

    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id")
);
