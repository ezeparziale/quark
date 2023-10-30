import prismadb from "@/utils/prismadb"

interface IDeleteUser {
  id: string
}

export async function deleteUser({ id }: IDeleteUser) {
  try {
    await prismadb.user.delete({ where: { id } })
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
