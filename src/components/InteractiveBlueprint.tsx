import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  MarkerType,
  ConnectionLineType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { blueprintData, getIconComponent, getCategoryColor, getEdgeColor } from '../data/blueprintData';

// Custom node component with icon
const CustomNode = ({ data }: { data: any }) => {
  const IconComponent = getIconComponent(data.icon);
  
  return (
    <div className={`px-4 py-3 rounded-lg shadow-md ${getCategoryColor(data.category)}`}>
      <div className="flex items-center">
        <IconComponent className="h-5 w-5 mr-2 text-white" />
        <div className="text-white font-medium">{data.label}</div>
      </div>
    </div>
  );
};

// Node types definition
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

interface InteractiveBlueprintProps {
  onNodeClickNavigate: (nodeId: string) => void;
}

const InteractiveBlueprint: React.FC<InteractiveBlueprintProps> = ({ onNodeClickNavigate }) => {
  // Convert blueprint data to ReactFlow nodes
  const initialNodes: Node[] = blueprintData.map((node) => ({
    id: node.id,
    type: 'custom',
    position: node.position || { x: 0, y: 0 },
    data: { 
      label: node.label,
      description: node.description,
      category: node.category,
      icon: node.icon
    },
    style: { 
      width: 'auto',
    }
  }));

  // Generate edges based on parent-child relationships
  const initialEdges: Edge[] = [];
  
  // Add edges between parent and child nodes
  blueprintData.forEach(node => {
    if (node.parentNode) {
      initialEdges.push({
        id: `e-${node.parentNode}-${node.id}`,
        source: node.parentNode,
        target: node.id,
        animated: true,
        style: { stroke: getEdgeColor(node.category), strokeWidth: 2 },
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: getEdgeColor(node.category),
        }
      });
    }
  });
  
  // Add connections between main category nodes
  initialEdges.push(
    {
      id: 'e-core-mental',
      source: 'core-design-principles',
      target: 'mental-operating-systems',
      animated: false,
      style: { stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5,5' },
      type: 'straight',
    },
    {
      id: 'e-core-implementation',
      source: 'core-design-principles',
      target: 'implementation-patterns',
      animated: false,
      style: { stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5,5' },
      type: 'straight',
    },
    {
      id: 'e-mental-implementation',
      source: 'mental-operating-systems',
      target: 'implementation-patterns',
      animated: false,
      style: { stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '5,5' },
      type: 'straight',
    },
    {
      id: 'e-implementation-security',
      source: 'implementation-patterns',
      target: 'security-principles',
      animated: false,
      style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5,5' },
      type: 'straight',
    }
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#6366f1', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#6366f1',
      }
    }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // Navigate to the corresponding section on the blueprint page
    onNodeClickNavigate(node.id);
  }, [onNodeClickNavigate]);

  return (
    <div className="w-full h-[500px] bg-gray-900 rounded-lg border border-gray-700 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-900"
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#6366f1' },
        }}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
      >
        <Controls className="bg-gray-800 border-gray-700" />
        <MiniMap 
          className="bg-gray-800 border-gray-700"
          nodeColor={(node) => {
            const category = (node.data?.category as string) || 'default';
            switch (category) {
              case 'core': return '#6366f1';
              case 'architecture': return '#3b82f6';
              case 'mental': return '#8b5cf6';
              case 'implementation': return '#10b981';
              case 'security': return '#ef4444';
              default: return '#6b7280';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.8)"
        />
        <Background color="#374151" gap={16} />
      </ReactFlow>

      {/* Interaction Hint */}
      <div className="absolute top-4 left-4 bg-gray-800/90 border border-gray-700 rounded-lg p-3 text-sm text-gray-300">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
          <span>Click nodes to navigate to detailed explanations</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveBlueprint;