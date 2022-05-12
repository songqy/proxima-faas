import NebulaUI, { Modal, Button, useState } from '@nebulare/ui';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ModalDialog = () => {
  const [visible, setVisible] = useState(false);
  const openModal = () => {
    setVisible(true);
  };
  const onOk = async () => {
    await sleep(1000);
    setVisible(false);
  };
  const onCancel = async () => {
    await sleep(1000);
    setVisible(false);
  };

  return (
    <>
      <Button onClick={openModal}>open modal</Button>
      {visible && (
        <Modal title="modal title" width={400} onOk={onOk} onCancel={onCancel}>
          this is a modal
        </Modal>
      )}
    </>
  );
};

export default ModalDialog;
