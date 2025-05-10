import { FC, MouseEventHandler } from 'react';
import classNames from 'classnames';
import Image from 'next/image';


export const ButtonIcon: FC<any> = ({ text, onClick, svg, color, hoverColor,tooltip,disabled,className="" }) => {
  return (
    <div  onClick={onClick} className={`tooltip bg-gray-200 p-2 rounded-full ${className}`}>
    {tooltip && <p className="tooltiptext">{tooltip}</p>}
    <Image
      
      className="cursor-pointer"
      alt=""
      width={20}
      height={20}
      src={svg}
    />
    </div>
  );
};

interface ButtonProps {
  text: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  svgUrl?: string;
  color: string;
  hoverColor: string;
}

// Generic Button Component
const Button: FC<ButtonProps> = ({ text, onClick, svgUrl, color, hoverColor }) => {
  return (
    <button
      onClick={onClick}
      className={classNames(
        'inline-flex items-center px-4 py-2 text-sm font-medium rounded-2xl',
        `bg-${color}-600`,
        `hover:bg-${hoverColor}-00`,
        'text-white'
      )}
    >
      {svgUrl && <Image src={svgUrl} alt={`${text} icon`} width={20} height={20} className="mr-2" />}
      {text}
    </button>
  );
};

// Archive Button Component
interface DefaultButtonProps {
  text: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  svgUrl?: string;
}

export const DefaultButton: FC<DefaultButtonProps> = ({ text, onClick, svgUrl }) => {
  return <Button text={text} onClick={onClick} svgUrl={svgUrl} color="gray" hoverColor="gray" />;
};

// Delete Button Component
interface DeleteButtonProps {
  text: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  svgUrl?: string;
}

export const DeleteButton: FC<DeleteButtonProps> = ({ text, onClick, svgUrl }) => {
  return <Button text={text} onClick={onClick} svgUrl={svgUrl} color="red" hoverColor="red" />;
};

// Restore Button Component
interface ActionButtonProps {
  text: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  svgUrl?: string;
  color?:string
}

export const ActionButton: FC<ActionButtonProps> = ({ text, onClick, svgUrl }) => {
  return <Button text={text} onClick={onClick} svgUrl={svgUrl} color={"gray"} hoverColor="indigo" />;
};

// Exporting all components together
const Buttons = {
  DefaultButton,
  DeleteButton,
  ActionButton,
  ButtonIcon
};

export default Buttons;
