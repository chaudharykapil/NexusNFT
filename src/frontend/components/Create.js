import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import axios from 'axios' // Use axios for making HTTP requests
import { Buffer } from "buffer"

const apiKey = 'ba3f2f38101a806894b7'; // Replace with your Pinata API Key
const apiSecret = '60f052b9ee97dcd20b79a90f5668a28664f2055ef9f724e7d841bf11ad72dd37'; // Replace with your Pinata Secret Key

const CreateNFT = ({ marketplace, nft }) => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const uploadToPinata = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (file) {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
          maxRedirects: 0,
          headers: {
            'Content-Type': 'multipart/form-data',
            'pinata_api_key': apiKey,
            'pinata_secret_api_key': apiSecret,
          },
        });

        setImage(response.data.IpfsHash);
        console.log('File uploaded to IPFS with CID:', response.data.IpfsHash);
      } catch (error) {
        console.error('Error uploading file to IPFS:', error.message);
      }
    }
  }

  const createNFT = async () => {
    if (!image || !price || !name || !description) return
    try {
      const metadata = {
        image: `https://gateway.pinata.cloud/ipfs/${image}`,
        price,
        name,
        description
      }
      const result = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': apiKey,
          'pinata_secret_api_key': apiSecret,
        },
      });

      mintThenList(result.data.IpfsHash)
    } catch (error) {
      console.log("IPFS URI upload error: ", error)
    }
  }

  const mintThenList = async (result) => {
    const uri = `https://gateway.pinata.cloud/ipfs/${result}`
    // mint nft 
    await(await nft.mint(uri)).wait()
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    // approve marketplace to spend nft
    await(await nft.setApprovalForAll(marketplace.address, true)).wait()
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString())
    await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()
  }

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToPinata}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CreateNFT
