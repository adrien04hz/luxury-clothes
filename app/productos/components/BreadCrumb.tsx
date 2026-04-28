import Link from "next/link";
import { breadCrumbs } from "../utils/producto";

export default function BreadCrumb({ categoria, subcategoria, genero, search = false, marca}: { categoria: number; subcategoria?: number; genero?: number; search?: boolean; marca?: number }) {

    const crumbs = breadCrumbs({
        id_categoria: categoria,
        id_subcategoria: subcategoria,
        id_genero: genero,
        id_marca: marca
    });

    return (
        <div className="flex items-center justify-start space-x-2 w-fit mt-3 text-md font-light">
            {
                crumbs.categoria && !search && (
                    <div className="w-fit hover:cursor-default">
                        {crumbs.categoria}
                    </div>
                )
            }

            {
                crumbs.subcategoria && !search && (
                    <>
                        <span className="hover:cursor-default">/</span>
                        <div className="w-fit hover:cursor-default">
                           {crumbs.subcategoria}
                        </div>
                    </>
                )
            }
            {
                crumbs.genero && !search && (
                    <>
                        <span className="hover:cursor-default">/</span>
                        <div className="w-fit hover:cursor-default">
                            {crumbs.genero}
                        </div>
                    </>
                )
            }

            {
                crumbs.marca && !search && (
                    <>
                        <span className="hover:cursor-default">/</span>
                        <div className="w-fit hover:cursor-default">
                            {crumbs.marca}
                        </div>
                    </>
                )
            }

            {
                search && (
                    <>
                        <div className="w-fit hover:cursor-default">
                            Búsquedas
                        </div>
                        <span className="hover:cursor-default">/</span>
                    </>
                )
            }
        </div>
    );
}