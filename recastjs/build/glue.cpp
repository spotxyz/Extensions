
#include <emscripten.h>

extern "C" {

// Not using size_t for array indices as the values used by the javascript code are signed.

EM_JS(void, array_bounds_check_error, (size_t idx, size_t size), {
  throw 'Array index ' + idx + ' out of bounds: [0,' + size + ')';
});

void array_bounds_check(const int array_size, const int array_idx) {
  if (array_idx < 0 || array_idx >= array_size) {
    array_bounds_check_error(array_idx, array_size);
  }
}

// VoidPtr

void EMSCRIPTEN_KEEPALIVE emscripten_bind_VoidPtr___destroy___0(void** self) {
  delete self;
}

// rcConfig

rcConfig* EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_rcConfig_0() {
  return new rcConfig();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_get_width_0(rcConfig* self) {
  return self->width;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_set_width_1(rcConfig* self, int arg0) {
  self->width = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_get_height_0(rcConfig* self) {
  return self->height;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_set_height_1(rcConfig* self, int arg0) {
  self->height = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_get_tileSize_0(rcConfig* self) {
  return self->tileSize;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_set_tileSize_1(rcConfig* self, int arg0) {
  self->tileSize = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_get_borderSize_0(rcConfig* self) {
  return self->borderSize;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_set_borderSize_1(rcConfig* self, int arg0) {
  self->borderSize = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_get_cs_0(rcConfig* self) {
  return self->cs;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_set_cs_1(rcConfig* self, float arg0) {
  self->cs = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_get_ch_0(rcConfig* self) {
  return self->ch;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_set_ch_1(rcConfig* self, float arg0) {
  self->ch = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_get_bmin_1(rcConfig* self, int arg0) {
  return self->bmin[arg0];
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_set_bmin_2(rcConfig* self, int arg0, float arg1) {
  self->bmin[arg0] = arg1;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_get_bmax_1(rcConfig* self, int arg0) {
  return self->bmax[arg0];
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_set_bmax_2(rcConfig* self, int arg0, float arg1) {
  self->bmax[arg0] = arg1;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_get_walkableSlopeAngle_0(rcConfig* self) {
  return self->walkableSlopeAngle;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_set_walkableSlopeAngle_1(rcConfig* self, float arg0) {
  self->walkableSlopeAngle = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_get_walkableHeight_0(rcConfig* self) {
  return self->walkableHeight;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_set_walkableHeight_1(rcConfig* self, int arg0) {
  self->walkableHeight = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_get_walkableClimb_0(rcConfig* self) {
  return self->walkableClimb;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_set_walkableClimb_1(rcConfig* self, int arg0) {
  self->walkableClimb = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_get_walkableRadius_0(rcConfig* self) {
  return self->walkableRadius;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_set_walkableRadius_1(rcConfig* self, int arg0) {
  self->walkableRadius = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_get_maxEdgeLen_0(rcConfig* self) {
  return self->maxEdgeLen;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_set_maxEdgeLen_1(rcConfig* self, int arg0) {
  self->maxEdgeLen = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_get_maxSimplificationError_0(rcConfig* self) {
  return self->maxSimplificationError;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_set_maxSimplificationError_1(rcConfig* self, float arg0) {
  self->maxSimplificationError = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_get_minRegionArea_0(rcConfig* self) {
  return self->minRegionArea;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_set_minRegionArea_1(rcConfig* self, int arg0) {
  self->minRegionArea = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_get_mergeRegionArea_0(rcConfig* self) {
  return self->mergeRegionArea;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_set_mergeRegionArea_1(rcConfig* self, int arg0) {
  self->mergeRegionArea = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_get_maxVertsPerPoly_0(rcConfig* self) {
  return self->maxVertsPerPoly;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_set_maxVertsPerPoly_1(rcConfig* self, int arg0) {
  self->maxVertsPerPoly = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_get_detailSampleDist_0(rcConfig* self) {
  return self->detailSampleDist;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_set_detailSampleDist_1(rcConfig* self, float arg0) {
  self->detailSampleDist = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_get_detailSampleMaxError_0(rcConfig* self) {
  return self->detailSampleMaxError;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig_set_detailSampleMaxError_1(rcConfig* self, float arg0) {
  self->detailSampleMaxError = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_rcConfig___destroy___0(rcConfig* self) {
  delete self;
}

// Vec3

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_Vec3_0() {
  return new Vec3();
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_Vec3_3(float x, float y, float z) {
  return new Vec3(x, y, z);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_get_x_0(Vec3* self) {
  return self->x;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_set_x_1(Vec3* self, float arg0) {
  self->x = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_get_y_0(Vec3* self) {
  return self->y;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_set_y_1(Vec3* self, float arg0) {
  self->y = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_get_z_0(Vec3* self) {
  return self->z;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_set_z_1(Vec3* self, float arg0) {
  self->z = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3___destroy___0(Vec3* self) {
  delete self;
}

// Triangle

Triangle* EMSCRIPTEN_KEEPALIVE emscripten_bind_Triangle_Triangle_0() {
  return new Triangle();
}

const Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Triangle_getPoint_1(Triangle* self, int n) {
  return &self->getPoint(n);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Triangle___destroy___0(Triangle* self) {
  delete self;
}

// DebugNavMesh

DebugNavMesh* EMSCRIPTEN_KEEPALIVE emscripten_bind_DebugNavMesh_DebugNavMesh_0() {
  return new DebugNavMesh();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_DebugNavMesh_getTriangleCount_0(DebugNavMesh* self) {
  return self->getTriangleCount();
}

const Triangle* EMSCRIPTEN_KEEPALIVE emscripten_bind_DebugNavMesh_getTriangle_1(DebugNavMesh* self, int n) {
  return &self->getTriangle(n);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_DebugNavMesh___destroy___0(DebugNavMesh* self) {
  delete self;
}

// dtNavMesh

void EMSCRIPTEN_KEEPALIVE emscripten_bind_dtNavMesh___destroy___0(dtNavMesh* self) {
  delete self;
}

// NavmeshData

NavmeshData* EMSCRIPTEN_KEEPALIVE emscripten_bind_NavmeshData_NavmeshData_0() {
  return new NavmeshData();
}

void* EMSCRIPTEN_KEEPALIVE emscripten_bind_NavmeshData_get_dataPointer_0(NavmeshData* self) {
  return self->dataPointer;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_NavmeshData_set_dataPointer_1(NavmeshData* self, void* arg0) {
  self->dataPointer = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_NavmeshData_get_size_0(NavmeshData* self) {
  return self->size;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_NavmeshData_set_size_1(NavmeshData* self, int arg0) {
  self->size = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_NavmeshData___destroy___0(NavmeshData* self) {
  delete self;
}

// NavPath

int EMSCRIPTEN_KEEPALIVE emscripten_bind_NavPath_getPointCount_0(NavPath* self) {
  return self->getPointCount();
}

const Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_NavPath_getPoint_1(NavPath* self, int n) {
  return &self->getPoint(n);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_NavPath___destroy___0(NavPath* self) {
  delete self;
}

// dtObstacleRef

void EMSCRIPTEN_KEEPALIVE emscripten_bind_dtObstacleRef___destroy___0(dtObstacleRef* self) {
  delete self;
}

// dtCrowdAgentParams

dtCrowdAgentParams* EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_dtCrowdAgentParams_0() {
  return new dtCrowdAgentParams();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_get_radius_0(dtCrowdAgentParams* self) {
  return self->radius;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_set_radius_1(dtCrowdAgentParams* self, float arg0) {
  self->radius = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_get_height_0(dtCrowdAgentParams* self) {
  return self->height;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_set_height_1(dtCrowdAgentParams* self, float arg0) {
  self->height = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_get_maxAcceleration_0(dtCrowdAgentParams* self) {
  return self->maxAcceleration;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_set_maxAcceleration_1(dtCrowdAgentParams* self, float arg0) {
  self->maxAcceleration = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_get_maxSpeed_0(dtCrowdAgentParams* self) {
  return self->maxSpeed;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_set_maxSpeed_1(dtCrowdAgentParams* self, float arg0) {
  self->maxSpeed = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_get_collisionQueryRange_0(dtCrowdAgentParams* self) {
  return self->collisionQueryRange;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_set_collisionQueryRange_1(dtCrowdAgentParams* self, float arg0) {
  self->collisionQueryRange = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_get_pathOptimizationRange_0(dtCrowdAgentParams* self) {
  return self->pathOptimizationRange;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_set_pathOptimizationRange_1(dtCrowdAgentParams* self, float arg0) {
  self->pathOptimizationRange = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_get_separationWeight_0(dtCrowdAgentParams* self) {
  return self->separationWeight;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_set_separationWeight_1(dtCrowdAgentParams* self, float arg0) {
  self->separationWeight = arg0;
}

unsigned char EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_get_updateFlags_0(dtCrowdAgentParams* self) {
  return self->updateFlags;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_set_updateFlags_1(dtCrowdAgentParams* self, unsigned char arg0) {
  self->updateFlags = arg0;
}

unsigned char EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_get_obstacleAvoidanceType_0(dtCrowdAgentParams* self) {
  return self->obstacleAvoidanceType;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_set_obstacleAvoidanceType_1(dtCrowdAgentParams* self, unsigned char arg0) {
  self->obstacleAvoidanceType = arg0;
}

unsigned char EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_get_queryFilterType_0(dtCrowdAgentParams* self) {
  return self->queryFilterType;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_set_queryFilterType_1(dtCrowdAgentParams* self, unsigned char arg0) {
  self->queryFilterType = arg0;
}

void* EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_get_userData_0(dtCrowdAgentParams* self) {
  return self->userData;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams_set_userData_1(dtCrowdAgentParams* self, void* arg0) {
  self->userData = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_dtCrowdAgentParams___destroy___0(dtCrowdAgentParams* self) {
  delete self;
}

// NavMesh

NavMesh* EMSCRIPTEN_KEEPALIVE emscripten_bind_NavMesh_NavMesh_0() {
  return new NavMesh();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_NavMesh_destroy_0(NavMesh* self) {
  self->destroy();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_NavMesh_build_5(NavMesh* self, const float* positions, const int positionCount, const int* indices, const int indexCount, const rcConfig* config) {
  self->build(positions, positionCount, indices, indexCount, *config);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_NavMesh_buildFromNavmeshData_1(NavMesh* self, NavmeshData* data) {
  self->buildFromNavmeshData(data);
}

NavmeshData* EMSCRIPTEN_KEEPALIVE emscripten_bind_NavMesh_getNavmeshData_0(NavMesh* self) {
  static NavmeshData temp;
  return (temp = self->getNavmeshData(), &temp);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_NavMesh_freeNavmeshData_1(NavMesh* self, NavmeshData* data) {
  self->freeNavmeshData(data);
}

DebugNavMesh* EMSCRIPTEN_KEEPALIVE emscripten_bind_NavMesh_getDebugNavMesh_0(NavMesh* self) {
  static DebugNavMesh temp;
  return (temp = self->getDebugNavMesh(), &temp);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_NavMesh_getClosestPoint_1(NavMesh* self, const Vec3* position) {
  static Vec3 temp;
  return (temp = self->getClosestPoint(*position), &temp);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_NavMesh_getRandomPointAround_2(NavMesh* self, const Vec3* position, float maxRadius) {
  static Vec3 temp;
  return (temp = self->getRandomPointAround(*position, maxRadius), &temp);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_NavMesh_moveAlong_2(NavMesh* self, const Vec3* position, const Vec3* destination) {
  static Vec3 temp;
  return (temp = self->moveAlong(*position, *destination), &temp);
}

dtNavMesh* EMSCRIPTEN_KEEPALIVE emscripten_bind_NavMesh_getNavMesh_0(NavMesh* self) {
  return self->getNavMesh();
}

NavPath* EMSCRIPTEN_KEEPALIVE emscripten_bind_NavMesh_computePath_2(NavMesh* self, const Vec3* start, const Vec3* end) {
  static NavPath temp;
  return (temp = self->computePath(*start, *end), &temp);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_NavMesh_setDefaultQueryExtent_1(NavMesh* self, const Vec3* extent) {
  self->setDefaultQueryExtent(*extent);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_NavMesh_getDefaultQueryExtent_0(NavMesh* self) {
  static Vec3 temp;
  return (temp = self->getDefaultQueryExtent(), &temp);
}

dtObstacleRef* EMSCRIPTEN_KEEPALIVE emscripten_bind_NavMesh_addCylinderObstacle_3(NavMesh* self, const Vec3* position, float radius, float height) {
  return self->addCylinderObstacle(*position, radius, height);
}

dtObstacleRef* EMSCRIPTEN_KEEPALIVE emscripten_bind_NavMesh_addBoxObstacle_3(NavMesh* self, const Vec3* position, const Vec3* extent, float angle) {
  return self->addBoxObstacle(*position, *extent, angle);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_NavMesh_removeObstacle_1(NavMesh* self, dtObstacleRef* obstacle) {
  self->removeObstacle(obstacle);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_NavMesh_update_0(NavMesh* self) {
  self->update();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_NavMesh___destroy___0(NavMesh* self) {
  delete self;
}

// Crowd

Crowd* EMSCRIPTEN_KEEPALIVE emscripten_bind_Crowd_Crowd_3(const int maxAgents, const float maxAgentRadius, dtNavMesh* nav) {
  return new Crowd(maxAgents, maxAgentRadius, nav);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Crowd_destroy_0(Crowd* self) {
  self->destroy();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Crowd_addAgent_2(Crowd* self, const Vec3* position, const dtCrowdAgentParams* params) {
  return self->addAgent(*position, params);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Crowd_removeAgent_1(Crowd* self, const int idx) {
  self->removeAgent(idx);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Crowd_update_1(Crowd* self, const float dt) {
  self->update(dt);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Crowd_getAgentPosition_1(Crowd* self, const int idx) {
  static Vec3 temp;
  return (temp = self->getAgentPosition(idx), &temp);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Crowd_getAgentVelocity_1(Crowd* self, const int idx) {
  static Vec3 temp;
  return (temp = self->getAgentVelocity(idx), &temp);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Crowd_getAgentNextTargetPath_1(Crowd* self, const int idx) {
  static Vec3 temp;
  return (temp = self->getAgentNextTargetPath(idx), &temp);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Crowd_getAgentState_1(Crowd* self, const int idx) {
  return self->getAgentState(idx);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Crowd_overOffmeshConnection_1(Crowd* self, const int idx) {
  return self->overOffmeshConnection(idx);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Crowd_agentGoto_2(Crowd* self, const int idx, const Vec3* destination) {
  self->agentGoto(idx, *destination);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Crowd_agentTeleport_2(Crowd* self, const int idx, const Vec3* destination) {
  self->agentTeleport(idx, *destination);
}

dtCrowdAgentParams* EMSCRIPTEN_KEEPALIVE emscripten_bind_Crowd_getAgentParameters_1(Crowd* self, const int idx) {
  static dtCrowdAgentParams temp;
  return (temp = self->getAgentParameters(idx), &temp);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Crowd_setAgentParameters_2(Crowd* self, const int idx, const dtCrowdAgentParams* params) {
  self->setAgentParameters(idx, params);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Crowd_setDefaultQueryExtent_1(Crowd* self, const Vec3* extent) {
  self->setDefaultQueryExtent(*extent);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Crowd_getDefaultQueryExtent_0(Crowd* self) {
  static Vec3 temp;
  return (temp = self->getDefaultQueryExtent(), &temp);
}

NavPath* EMSCRIPTEN_KEEPALIVE emscripten_bind_Crowd_getCorners_1(Crowd* self, const int idx) {
  static NavPath temp;
  return (temp = self->getCorners(idx), &temp);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Crowd___destroy___0(Crowd* self) {
  delete self;
}

}

