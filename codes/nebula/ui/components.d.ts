import type { NebulaElement } from './interface';
export interface ButtonProps {
    type?: 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text';
    onClick?: () => void;
    size?: 'small' | 'middle' | 'large';
}
export declare const Button: (props: ButtonProps) => NebulaElement;
export interface SpaceProps {
    size?: 'small' | 'middle' | 'large';
}
export declare const Space: (props: SpaceProps) => NebulaElement;
export declare const Text = "Text";
export declare const Table = "Table";
export declare const Avatar = "Avatar";
export declare const Badge = "Badge";
export declare const Input = "Input";
