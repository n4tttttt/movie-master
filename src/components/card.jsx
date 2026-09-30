import '@ant-design/v5-patch-for-react-19';
import React from 'react';
import { Card, Col, Popconfirm, Typography} from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined} from '@ant-design/icons';
import Placeholder from '../images/Placeholder.png'
const { Paragraph } = Typography;

export default function Cards({movie, openModalfunction, openModal2function, deleteFunction}) {
    return (
    <>
        <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={
                <img
                  alt={movie.title}
                  src={movie.image && (movie.image.startsWith("https://") || movie.image.startsWith("http://")) ? movie.image : Placeholder}
                  style={{ height: '260px', objectFit: 'cover' }}
                />
              }
              style={{border: '1px #8000ff solid'}}
              actions={[
                <EyeOutlined key="view" onClick={openModal2function} style={{ color: '#8000ff' }} />,
                <EditOutlined key="edit" onClick={openModalfunction} style={{ color: '#8000ff' }} />,
                <Popconfirm
                  title="Delete this movie?"
                  description="Are you sure you want to delete this movie?"
                  onConfirm={deleteFunction}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined key="delete" style={{ color: '#ff4d4f' }} />
                </Popconfirm>
              ]}
            >
              <Card.Meta
                title={movie.title}
                description={
                  <div>
                    <Paragraph style={{ margin: '4px 0' }}><strong>Director:</strong> {movie.director}</Paragraph>
                    <Paragraph style={{ margin: '4px 0' }}><strong>Genre:</strong> {movie.genre}</Paragraph>
                    <Paragraph style={{ margin: '4px 0' }}><strong>Release Year:</strong> {movie.release_year}</Paragraph>
                    <Paragraph style={{ margin: '4px 0' }}><strong>Rating:</strong> {movie.rating}/100</Paragraph>
                    <Paragraph style={{ margin: '8px 0 0 0', color: '#666', fontSize: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {movie.description}
                    </Paragraph>
                  </div>
                }
              />
            </Card>
          </Col>
    </>)
}