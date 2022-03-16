import { useNetwork } from 'wagmi'
import { NETWORKS, SupportedNetworks } from '../lib/constants'
import { getContractAddress, SupportedContracts } from '../lib/contracts'
import hardhatContracts from '../../generated/contracts/hardhat_contracts.json'
import config from '../lib/config'

type UseContractAddress = {
  data: string | undefined
  loading: boolean
  error: Error | undefined
}

const proxyHardhatContracts: any = hardhatContracts

const getLocalContractAddress = (name: SupportedContracts): string | undefined =>
  proxyHardhatContracts[31337][0].contracts[name]?.address

export const useContractAddress = (name: SupportedContracts): UseContractAddress => {
  const [{ data, error, loading = false }] = useNetwork()

  const chainId =
    data?.chain?.id ?? NETWORKS[config.DEFAULT_NETWORK_NAME as unknown as SupportedNetworks].chainId
  const isLocalhost = chainId === NETWORKS.localhost.chainId
  const chainName = ((data?.chain?.name && data?.chain?.name.toLowerCase()) ||
    config.DEFAULT_NETWORK_NAME) as SupportedNetworks

  let contractAddress
  if (chainId) {
    contractAddress = isLocalhost
      ? getLocalContractAddress(name)
      : getContractAddress(name, chainName)
  }

  return {
    data: contractAddress,
    error,
    loading,
  }
}
