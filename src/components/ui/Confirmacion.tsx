import { Modal } from './Modal';
import { Boton } from './Boton';

interface Props {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function Confirmacion({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  onConfirmar,
  onCancelar,
}: Props) {
  return (
    <Modal abierto={abierto} titulo={titulo} onCerrar={onCancelar} ancho="max-w-md">
      <p className="text-sm leading-relaxed text-negro/75">{mensaje}</p>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Boton variante="secundario" onClick={onCancelar}>
          Cancelar
        </Boton>
        <Boton variante="peligro" onClick={onConfirmar}>
          {textoConfirmar}
        </Boton>
      </div>
    </Modal>
  );
}
