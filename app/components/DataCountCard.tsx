// DataCountCard.tsx

import { Card, Col, Row, Statistic } from "antd";

interface DataCountProps {
  counts: {
    dosen: number;
    kelas: number;
    mataKuliah: number;
    ruangan: number;
  };
}

const DataCountCard: React.FC<DataCountProps> = ({ counts }) => {
  return (
    <Row gutter={16} style={{ marginBottom: 16 }}>
      {Object.keys(counts).map((key) => (
        <Col key={key} xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic title={key} value={counts[key as keyof typeof counts]} />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default DataCountCard;
