import { FC } from 'react';
import './styles.scss';

type Props = {
  src: string;
};

const ImageWithBackground: FC<Props> = ({ src }) => {
  return (
    <div className="image-with-background">
      <div style={{ background: `url("${src}")` }} className="image-fill" />
      <div
        style={{ background: `url("${src}")` }}
        className="image-fill-close"
      />
      <img src={src} />
    </div>
  );
};

export default ImageWithBackground;
