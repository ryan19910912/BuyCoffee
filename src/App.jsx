import {
  Container,
  Box,
  Flex,
  Text,
  Image,
  Center,
  SimpleGrid,
  Card,
  CardBody,
  Heading,
  Skeleton,
  Input,
  Textarea,
  Stack,
  Tooltip
} from '@chakra-ui/react'

import CoffeeLogo from './coffee.svg'
import { ConnectWallet, useContract, useContractRead, Web3Button } from "@thirdweb-dev/react";
import { BUYACOFFEE_ADDRESS } from './const/contractAddress';
import { useState } from 'react';
import { ethers } from 'ethers'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { InfoOutlineIcon } from '@chakra-ui/icons'

export default function Home() {

  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const { contract } = useContract(BUYACOFFEE_ADDRESS)

  const MySwal = withReactContent(Swal)

  const {
    data: totalCoffee,
    isLoadong: loadingTotalCoffee
  } = useContractRead(contract, 'getTotalCoffee')

  const {
    data: allCoffee,
    isLoadong: loadingAllCoffee
  } = useContractRead(contract, 'getAllCoffee')

  return (
    <Box backgroundColor={'#FEFEFE'} width={'100%'} height={'100%'}>
      <Container maxWidth={'1200px'} width={'100%'}>
        <Flex
          padding={'0 10px'}
          backgroundColor={'#fff'}
          height={'120px'}
          borderRadius={'20px'}
          boxShadow={'lg'}
        >
          <Center width={'100%'}>
            <Image
              src={CoffeeLogo}
              width={'50px'}
              height={'50px'}
              alt={'Buy Me a Coffee'}
            />
            <Text
              width={'100%'}
              fontWeight={'600'}
              fontSize={'24px'}
            >
              Buy Me A Coffee
            </Text>

            <Box margin={'2rem'}>
              <ConnectWallet
                btnTitle='Connect Wallet'
                theme='light' />
            </Box>

          </Center>
        </Flex>

        <Flex
          width={'100%'}
          alignItems={'center'}
          justifyContent={'space-between'}
          paddingY={'20px'}
          height={'100px'}
          flexDirection={'column'}
        >
          <SimpleGrid
            columns={'2'}
            spacing={'10'}
            marginTop={'40px'}
            width={'100%'}>
            <Box>
              <Card>
                <CardBody>
                  <Heading
                    size={'md'}
                    mb={'20px'}
                  >
                    Buy Me a Coffee
                  </Heading>

                  <Text
                    fontSize={'xm'}
                    paddingY={'10px'}
                  >Your Name</Text>

                  <Input
                    backgroundColor={'gray.100'}
                    maxLength={'16'}
                    placeholder='Please Enter Your Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <Text
                    fontSize={'xm'}
                    paddingY={'10px'}
                  >Your Message</Text>

                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    backgroundColor={'gray.100'}
                    placeholder='Please Enter Your Message'
                  />

                  <Box marginTop={'20px'}>
                    <Center>
                      <Web3Button
                        contractAddress={BUYACOFFEE_ADDRESS}
                        action={async () => {
                          await contract.call('buyCoffee', [message, name],
                            { value: ethers.utils.parseEther('0.01') })
                        }}
                        onSuccess={() => {
                          setMessage('')
                          setName('')
                          MySwal.fire({
                            title: 'Transaction Success！',
                            icon: 'success'
                          })
                        }}
                        onError={() => {
                          MySwal.fire({
                            title: 'Transaction Fail！',
                            icon: 'error'
                          })
                        }}
                      >
                        Buy a Coffee ( 0.01 ETH )
                      </Web3Button>
                    </Center>
                  </Box>
                </CardBody>
              </Card>
            </Box>

            <Box>
              <Card
                maxHeight={'50vh'}
                overflow={'auto'}>
                <CardBody>
                  <Flex>
                    <Text
                      fontWeight={'bold'}
                      paddingRight={'10px'}
                    >Transaction History</Text>

                    <Text>Total Coffee：</Text>
                    <Skeleton
                      isLoaded={!loadingTotalCoffee}
                      width={'20px'}
                    >
                      {totalCoffee?.toString()}
                    </Skeleton>
                  </Flex>
                  {!loadingAllCoffee ?
                    (
                      <Box>
                        {allCoffee && allCoffee?.map((coffee, index) => {
                          return (
                            <Card key={index} marginY={'10px'}>
                              <CardBody>
                                <Flex alignItems={'center'} marginBottom={'10px'}>
                                  <Image
                                    src={CoffeeLogo}
                                    alt='Coffee'
                                    width={'30'}
                                    height={'30'}
                                    marginRight={'10px'}
                                  />
                                  <Text fontWeight={'bold'} marginRight={'10px'}>
                                    {coffee[2] ? coffee[2] : 'Anonymous'}
                                  </Text>
                                  <Tooltip
                                    label={`Wallet Address：${coffee[0]}`}
                                    backgroundColor={'gray.200'}
                                    color={'black'}
                                  >
                                    <InfoOutlineIcon />
                                  </Tooltip>
                                </Flex>
                                <Flex>
                                  <Text>
                                    {coffee[1] ? coffee[1] : 'No Message ...'}
                                  </Text>
                                </Flex>
                              </CardBody>
                            </Card>
                          )
                        })}
                      </Box>
                    ) : (
                      <Box>
                        Loading Data ...
                      </Box>
                    )}
                </CardBody>
              </Card>
            </Box>

          </SimpleGrid>

        </Flex>

      </Container>
    </Box >
  );
}
