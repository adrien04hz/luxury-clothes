import Link from "next/link";
import { breadCrumbs } from "../utils/producto";

export default function BreadCrumb({ categoria, subcategoria, genero, search = false}: { categoria: number; subcategoria?: number; genero?: number; search?: boolean}) {

    const crumbs = breadCrumbs({
        id_categoria: categoria,
        id_subcategoria: subcategoria,
        id_genero: genero
    });

    return (
        <div className="flex items-center justify-start space-x-2 w-fit mt-3 text-md font-light">
            {
                crumbs.categoria && !search && (
                    <div className="hover:underline w-fit">
                        <Link href={"#"}>{crumbs.categoria}</Link>
                    </div>
                )
            }

            {
                crumbs.subcategoria && !search && (
                    <>
                        <span>/</span>
                        <div className="hover:underline w-fit">
                            <Link href={"#"}>{crumbs.subcategoria}</Link>
                        </div>
                    </>
                )
            }
            {
                crumbs.genero && !search && (
                    <>
                        <span>/</span>
                        <div className="hover:underline w-fit">
                            <Link href={"#"}>{crumbs.genero}</Link>
                        </div>
                    </>
                )
            }

            {
                search && (
                    <>
                        <div className="hover:underline w-fit">
                            <Link href={"#"}>Búsquedas</Link>
                        </div>
                        <span>/</span>
                    </>
                )
            }
        </div>
    );
}