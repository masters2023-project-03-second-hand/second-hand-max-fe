import { useState } from 'react';
import { styled } from 'styled-components';
import ProfileImageUploader from '@components/ProfileImageUploader';
import { useImageFileReader } from '@hooks/useImageFileReader';
import { SignUpFormTitle } from './SignUpFormTitle';
import { SignUpField } from './SignUpField';
import { AddRegionButton } from './AddRegionButton';
import { AddRegionModal } from '@components/Modal/RegionSettingModal/AddRegionModal';
import { Address } from 'types/region';
import { AddedRegionItem } from '@components/Modal/AddedRegionItem';
import { ERROR_MESSAGE } from '@constants/ERROR_MESSAGE';
import useOAuth from '@hooks/useOAuth';

const SignUpForm: React.FC = () => {
  const { initOAuth } = useOAuth();
  const [imageSrc, setImageSrc] = useState<string>();
  const [file, setFile] = useState<File>();
  const [id, setId] = useState('');
  const [isAddRegionModalOpen, setIsAddRegionModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<
    Omit<Address, 'fullAddressName' | 'isSelected'>[]
  >([]);

  const onImageLoadSuccess = (result: string, file: File) => {
    setImageSrc(result);
    setFile(file);
  };

  const { onImageAdd } = useImageFileReader(onImageLoadSuccess);

  const onIdChange = (id: string) => {
    setId(id);
  };

  const onAddRegionModalOpen = () => setIsAddRegionModalOpen(true);
  const onAddRegionModalClose = () => setIsAddRegionModalOpen(false);

  const addAddress = ({ addressId, addressName }: Address) => {
    if (addresses.some((address) => address.addressId === addressId)) {
      throw new Error(ERROR_MESSAGE.DUPLICATE_REGION);
    }

    setAddresses((addresses) => [...addresses, { addressId, addressName }]);
  };

  const deleteAddress = (targetId: number) =>
    setAddresses((addresses) =>
      addresses.filter(({ addressId }) => addressId !== targetId),
    );

  const onSubmit = () => {
    initOAuth({
      action: 'sign-up',
      id,
      file,
      addressIds: addresses.map(({ addressId }) => addressId),
    });
  };

  const canSubmit = !!id && addresses.length > 0;
  const canAddRegion = addresses.length < 2;

  return (
    <StyledSignUpPage>
      <SignUpFormTitle {...{ canSubmit, onSubmit }} />
      <ProfileImageUploader {...{ imageSrc, onImageAdd }} />
      <SignUpField {...{ id, onIdChange }} />
      <AddedAddresses>
        {addresses?.map((address) => (
          <AddedRegionItem
            key={address.addressId}
            {...{
              addressName: address.addressName,
              onDeleteButtonClick: () => deleteAddress(address.addressId),
            }}
          />
        ))}
      </AddedAddresses>
      <AddRegionButton
        onClick={onAddRegionModalOpen}
        disabled={!canAddRegion}
      />
      {isAddRegionModalOpen && (
        <AddRegionModal
          {...{
            onModalClose: onAddRegionModalClose,
            addRegion: (address) => {
              try {
                addAddress(address);
                onAddRegionModalClose();
              } catch (error) {
                if (error instanceof Error) {
                  alert(error.message);
                }
              }
            },
          }}
        />
      )}
    </StyledSignUpPage>
  );
};

const StyledSignUpPage = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`;

const AddedAddresses = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default SignUpForm;
