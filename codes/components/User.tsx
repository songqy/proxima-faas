import Px, { Badge, Avatar, useState, useEffect } from '../px/ui';

export interface UserProps {
  count?: number;
}

const User = (props: UserProps) => {
  const { count = 0 } = props;

  const [size, setSize] = useState('small');

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
