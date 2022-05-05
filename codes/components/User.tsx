import NebulaUI, { Badge, Avatar, useState, useEffect } from '@nebula/ui';

export interface UserProps {
  count?: number;
}

type SizeType = 'large' | 'small' | 'default';

const User = (props: UserProps) => {
  const { count = 0 } = props;

  const [size, setSize] = useState<SizeType>('small');

  useEffect(() => {
    if (count < 5) {
      setSize('small');
    } else if (count < 10) {
      setSize('default');
    } else {
      setSize('large');
    }
  }, [count]);

  return (
    <Badge count={count}>
      <Avatar shape="square" size={size}>
        U
      </Avatar>
    </Badge>
  );
};

export default User;
