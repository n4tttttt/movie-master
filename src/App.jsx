import '@ant-design/v5-patch-for-react-19';
import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Row, Modal, Form, Input, InputNumber, Popconfirm, message, Typography, Layout, ConfigProvider, theme} from 'antd';
import { PlusOutlined, SunFilled, MoonFilled } from '@ant-design/icons';
import Placeholder from './images/Placeholder.png'
import reel from './images/reel.png'
import Cards from './components/card'
import axios from 'axios';

const { Title, Paragraph } = Typography;
const { Header } = Layout;

const MOCK_API_URL = 'https://6ab3a56b217e4365883134b5.mockapi.io/movies';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [statusCode, setStatusCode] = useState(null);
  const [statusTexts, setStatusTexts] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'true');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isPreviewOn, setIsPreviewOn] = useState(false)

  const [form] = Form.useForm();
  const imageUrl = Form.useWatch('image', form);

  const fetchMovies = async () => {
    setLoading(true);
    setStatusCode(null);
    setStatusTexts(null);
    try {
      const response = await axios.get(MOCK_API_URL);
      setMovies(response.data);
    } catch (error) {
      if (error.response) {
        console.error(`HTTP ${error.response.status}: ${error.response.data}`);
        setStatusCode(error.response.status);
        setStatusTexts(error.response.statusText || error.response.data);
      } else {
        console.error('Network/Request Error:', error.message);
      }
      message.error('Failed to load movies from MockAPI');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const openModal = (movie = null) => {
    setEditingMovie(movie);
    if (movie) {
      form.setFieldsValue(movie);
    } else {
      form.resetFields(); 
    }
    setIsModalOpen(true);
  };

  const openModal2 = (movie) => {
    setSelectedMovie(movie);
  };

  const closeModal2 = () => {
    setSelectedMovie(null);
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingMovie) {
        await axios.put(`${MOCK_API_URL}/${editingMovie.id}`, values);
        message.success('Movie updated successfully!');
      } else {
        await axios.post(MOCK_API_URL, values);
        message.success('Movie added successfully!');
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchMovies(); 
    } catch (error) {
      message.error('Failed to save movie data');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${MOCK_API_URL}/${id}`);
      message.success('Movie deleted successfully!');
      fetchMovies(); 
    } catch (error) {
      message.error('Failed to delete movie');
    }
  };

  const changeTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    localStorage.setItem('theme', nextMode);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          fontFamily: '"Oxanium", sans-serif',
        },
      }}
    >
      <Layout>
        <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: isDarkMode ? '#110022' : '#eeddff' }}>
          <Header style={{ margin: 0, padding: '10px', width: '100%', height: 'auto', backgroundColor: isDarkMode ? '#220044' : '#ddbbff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div style={{ display: 'flex', flexDirection: 'column'}}>
                <div style={{ display: 'flex'}}>
                  <img src={reel} alt="reel" className='reel' style={{height: 'calc(45px * 2)'}} />
                  <Title style={{ margin: 0, fontSize: 'calc(43px * 2)', backgroundImage: isDarkMode ? 'linear-gradient(0deg, #ffffff, #8000ff)' : 'linear-gradient(0deg, #000000, #8000ff)', backgroundClip: 'text', color: 'transparent' }}>M</Title>
                  <div style={{ display: 'flex', flexDirection: 'column'}}>
                    <Title style={{ margin: 0, backgroundImage: isDarkMode ? 'linear-gradient(0deg, #c080ff, #8000ff)' : 'linear-gradient(0deg, #400080, #8000ff)', backgroundClip: 'text', color: 'transparent' }}>ovie</Title>
                    <Title style={{ margin: 0, backgroundImage: isDarkMode ? 'linear-gradient(0deg, #ffffff, #c080ff)' : 'linear-gradient(0deg, #000000, #400080)', backgroundClip: 'text', color: 'transparent' }}>aster</Title>
                  </div>
                  
                </div>
                <Paragraph>
                  Keep Track of Everything you've watched and loved
                </Paragraph>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                <Button variant="solid" color="purple" icon={isDarkMode ? <MoonFilled /> : <SunFilled />} onClick={changeTheme} />
                <Button variant="solid" color="purple" icon={<PlusOutlined />} onClick={() => openModal()}>
                  Add Movie
                </Button>
              </div>
            </div>
          </Header>
          
          <div style={{ padding: '24px' }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'row', gap: '5px'}}>
                <Paragraph>Fetching Movie data, Please wait</Paragraph><img src={reel} alt="reel" className='reel' style={{height: '20px'}} />
              </div>
              
            ) : statusCode ? (
              <div style={{ margin: '50px', textAlign: 'center' }}>
                <Title style={{ fontSize: '100px' }}>{statusCode}</Title>
                <Paragraph style={{ fontWeight: 'bolder' }}>{statusTexts}</Paragraph>
              </div>
            ) : movies.length === 0 ? (
              <Paragraph>No movies found in the collection.</Paragraph>
            ) : (
              <Row gutter={[16, 16]}>
                {movies.map((movie) => (
                  <Cards movie={movie} key={movie.id} 
                  openModalfunction={() => openModal(movie)} 
                  openModal2function={() => openModal2(movie)} 
                  deleteFunction={() => handleDelete(movie.id)}/>
                  
                ))}
              </Row>
            )}

            <Modal 
              title={selectedMovie?.title || "Movie Details"} 
              open={!!selectedMovie}
              onCancel={closeModal2}
              footer={<Button variant="solid" color="purple" onClick={closeModal2}>Close</Button>}
            >
              {selectedMovie && (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <img 
                      src={selectedMovie.image && (selectedMovie.image.startsWith("https://") || selectedMovie.image.startsWith("http://")) ? selectedMovie.image : Placeholder} 
                      alt={selectedMovie.title} 
                      style={{ maxHeight: '300px', objectFit: 'contain' }}
                    />
                  </div>
                  <p><strong>Director:</strong> {selectedMovie.director}</p>
                  <p><strong>Genre:</strong> {selectedMovie.genre}</p>
                  <p><strong>Release Year:</strong> {selectedMovie.release_year}</p>
                  <p><strong>Rating:</strong> {selectedMovie.rating}/100</p>
                  <p><strong>Description:</strong> {selectedMovie.description}</p>
                </div>
              )}
            </Modal>

            <Modal
              title={editingMovie ? "Edit Movie Details" : "Add New Movie"}
              open={isModalOpen}
              onCancel={() => setIsModalOpen(false)}
              footer={null}
              destroyOnHidden
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <Button color="purple" variant="solid" onClick={() => setIsPreviewOn(!isPreviewOn)}>{isPreviewOn ? 'Hide Preview' : 'Show Preview'}</Button>
                {isPreviewOn && <img src={imageUrl || Placeholder} alt="preview" style={{width: '100%', borderRadius: '6px'}} />}
              </div>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFormSubmit}
                initialValues={{ release_year: new Date().getFullYear() }}
              >
                <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter Title' }]}>
                  <Input placeholder="Enter movie title" />
                </Form.Item>

                <Form.Item name="director" label="Director" rules={[{ required: true, message: "Please enter the Director's name" }]}>
                  <Input placeholder="Enter director name" />
                </Form.Item>

                <Form.Item name="genre" label="Genre" rules={[{ required: true, message: "Please enter the Movie's Genre" }]}>
                  <Input placeholder="Enter genre (e.g., Action, Sci-Fi)" />
                </Form.Item>

                <Form.Item name="release_year" label="Release Year" rules={[{ required: true, type: 'number', message: 'Please enter the release year' }]}>
                  <InputNumber style={{ width: '100%' }} placeholder="e.g. 2024" min={1800} max={2100} />
                </Form.Item>

                <Form.Item name="rating" label="Rating" rules={[{ required: true, type: 'number', message: 'Please enter a rating' }]}>
                  <InputNumber style={{ width: '100%' }} placeholder="Enter rating (0-100)" min={0} max={100} />
                </Form.Item>

                <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please enter the Description" }, { max: 1000, message: "Description is too long" }]}>
                  <Input.TextArea rows={3} placeholder="Enter movie summary or plot" />
                </Form.Item>

                <Form.Item name="image" label="Image URL" rules={[{ required: true, message: "Please enter an Image URL" }, {type: 'url', message: "This is Not an Image URL"}]}>
                  <Input placeholder="Paste image cover link address" />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                  <Button color="purple" style={{ marginRight: 8 }} onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button color="purple" variant="solid" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
      </Layout>
    </ConfigProvider>
  );
}
